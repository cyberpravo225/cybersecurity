import csv
import ctypes
import os
import threading
import time
import tkinter as tk
from collections import deque
from datetime import datetime
from tkinter import filedialog, messagebox, ttk

import cv2
import numpy as np
from PIL import Image, ImageTk
from ultralytics import YOLO

try:
    import win32gui
    import win32ui
except Exception as e:
    raise SystemExit(
        "Нужен pywin32. Установи: pip install pywin32\n"
        f"Ошибка: {e}"
    )

WINDOW_TITLE = "scrcpy_cam"
MODEL_NAME = "yolov8n.pt"
VIEW_W = 960
VIEW_H = 540
TARGET_FPS = 30
FRAME_TIME = 1.0 / TARGET_FPS
MAX_PROC_WIDTH = 1200
CONF_THRES = 0.30
MIN_BBOX_AREA = 900
GLOBAL_COOLDOWN_SEC = 0.08
TRACK_COOLDOWN_SEC = 0.45
CROSS_DEDUP_SEC = 0.70
CROSS_DEDUP_Y = 90
MATCH_DIST_X = 120
MATCH_DIST_Y = 120
MIN_TRACK_AGE = 1
MIN_DX_FOR_CROSS = 2
TRACK_STALE_FRAMES = 10
LINE_SIDE_MARGIN = 10
TRACK_HISTORY = 12
FINISH_ZONE_WIDTH = 80
ROTATE_CAPTURE_CCW = True
SHOW_CAPTURE_STATUS = True
MAX_PARTICIPANTS = 12

cv2.setUseOptimized(True)
cv2.setNumThreads(max(1, os.cpu_count() // 2))

model = YOLO(MODEL_NAME)

try:
    import torch
    USE_CUDA = torch.cuda.is_available()
except Exception:
    USE_CUDA = False

DEVICE = 0 if USE_CUDA else "cpu"
USE_HALF = bool(USE_CUDA)
YOLO_IMGSZ = 640 if USE_CUDA else 448

if os.name == "nt":
    try:
        ctypes.windll.user32.SetProcessDPIAware()
    except Exception:
        pass

PW_RENDERFULLCONTENT = 0x00000002
running = True
race_started = False
race_start_perf = None
paused_at = None
paused_total = 0.0

registered_numbers = []
pending_manual_number = None

raw_lock = threading.Lock()
raw_frames = deque(maxlen=20)
display_lock = threading.Lock()
latest_display_frame = None
pending_lock = threading.Lock()
pending_events = deque()

# events: (wall_time, number, lap_label, lap_sec, total_sec)
events = []
runners = {}
last_global_trigger = 0.0
tracks = {}
next_track_id = 1
frame_index = 0
track_states = {}
recent_crossings = deque(maxlen=120)

state_lock = threading.Lock()
state = {
    "status": "Нажми «Старт», чтобы начать забег.",
    "pending": 0,
    "elapsed": "00:00.00",
    "last_event": "-",
}

crop_lock = threading.Lock()
crop_cfg = {"left": 0, "right": 0, "top": 0, "bottom": 0}


def format_elapsed(seconds: float) -> str:
    seconds = max(0.0, float(seconds))
    m = int(seconds // 60)
    s = seconds % 60
    return f"{m:02d}:{s:05.2f}" if seconds >= 60 else f"{seconds:.2f}"


def draw_text(img, text, x, y, scale=0.6, color=(255, 255, 255), thickness=2):
    cv2.putText(img, text, (x, y), cv2.FONT_HERSHEY_SIMPLEX, scale, color, thickness, cv2.LINE_AA)


def set_state(**kwargs):
    with state_lock:
        state.update(kwargs)


def get_state():
    with state_lock:
        return state.copy()


def pending_append(item):
    with pending_lock:
        pending_events.append(item)


def pending_popleft():
    with pending_lock:
        return pending_events.popleft() if pending_events else None


def pending_len():
    with pending_lock:
        return len(pending_events)


def _get_crop_cfg():
    with crop_lock:
        return crop_cfg.copy()


def _set_crop_cfg(left, right, top, bottom):
    with crop_lock:
        crop_cfg.update(left=int(left), right=int(right), top=int(top), bottom=int(bottom))


def _apply_user_crop(frame):
    cfg = _get_crop_cfg()
    h, w = frame.shape[:2]
    left_px = int(w * cfg["left"] / 100)
    right_px = int(w * cfg["right"] / 100)
    top_px = int(h * cfg["top"] / 100)
    bottom_px = int(h * cfg["bottom"] / 100)

    x1 = max(0, min(w - 2, left_px))
    y1 = max(0, min(h - 2, top_px))
    x2 = max(x1 + 1, min(w, w - right_px))
    y2 = max(y1 + 1, min(h, h - bottom_px))
    cropped = frame[y1:y2, x1:x2]
    if cropped.size == 0:
        return frame
    if cropped.shape[:2] != (h, w):
        return cv2.resize(cropped, (w, h), interpolation=cv2.INTER_LINEAR)
    return cropped


def _lap_eta_score(number: str, now_perf: float):
    rec = runners.get(number)
    if not rec or not rec["times"]:
        return float("inf")
    times = rec["times"]
    since_last = now_perf - times[-1]
    base = rec["last_lap"] or rec["avg_lap"] or 25.0
    return since_last / max(base, 0.01)


def clear_session_data():
    global race_start_perf, paused_at, paused_total, last_global_trigger
    global tracks, next_track_id, frame_index, track_states

    with pending_lock:
        pending_events.clear()
    with raw_lock:
        raw_frames.clear()

    events.clear()
    tracks = {}
    track_states = {}
    recent_crossings.clear()
    next_track_id = 1
    frame_index = 0
    last_global_trigger = 0.0
    race_start_perf = None
    paused_at = None
    paused_total = 0.0

    for number in registered_numbers:
        runners[number] = {
            "times": [],
            "lap_times": [],
            "last_lap": None,
            "avg_lap": None,
            "total": 0.0,
            "last_wall": "-",
            "lap": 0,
        }


def refresh_table():
    for item in table.get_children():
        table.delete(item)

    now_perf = time.perf_counter()
    sorted_numbers = sorted(
        registered_numbers,
        key=lambda n: (_lap_eta_score(n, now_perf), -(runners[n]["lap"])),
        reverse=True,
    )
    for number in sorted_numbers:
        rec = runners[number]
        table.insert(
            "",
            "end",
            values=(
                number,
                rec["lap"],
                format_elapsed(rec["last_lap"] or 0.0) if rec["lap"] else "-",
                format_elapsed(rec["total"] or 0.0) if rec["lap"] else "-",
            ),
        )


def start_race():
    global race_started, race_start_perf, paused_at, paused_total
    if race_started:
        messagebox.showinfo("Уже идет", "Забег уже запущен.")
        return

    now = time.perf_counter()
    if race_start_perf is None:
        race_start_perf = now
        paused_total = 0.0
        paused_at = None
    elif paused_at is not None:
        paused_total += now - paused_at
        paused_at = None

    race_started = True
    refresh_table()
    set_state(status="Забег идет.", pending=pending_len(), elapsed="00:00.00", last_event="Старт")


def stop_race():
    global race_started, paused_at
    if not race_started:
        return
    race_started = False
    paused_at = time.perf_counter()
    set_state(status="Пауза. Нажми «Старт», чтобы продолжить.")


def reset_all():
    global race_started
    if not messagebox.askyesno("Сброс", "Очистить всё: таблицу, ожидание, таймер и историю?"):
        return
    race_started = False
    clear_session_data()
    refresh_table()
    set_state(status="Всё очищено. Нажми «Старт».", pending=0, elapsed="00:00.00", last_event="-")


def add_event_to_runner(number, perf_time, wall_time_str):
    number = str(number).strip()
    if number not in runners or race_start_perf is None:
        return

    rec = runners[number]
    rec["times"].append(perf_time)
    rec["lap"] += 1
    if rec["lap"] == 1:
        lap_time = perf_time - race_start_perf - paused_total
    else:
        lap_time = perf_time - rec["times"][-2]

    rec["lap_times"].append(lap_time)
    rec["last_lap"] = lap_time
    rec["avg_lap"] = sum(rec["lap_times"]) / len(rec["lap_times"])
    rec["total"] = perf_time - race_start_perf - paused_total
    rec["last_wall"] = wall_time_str

    events.append((wall_time_str, number, rec["lap"], lap_time, rec["total"]))
    refresh_table()
    set_state(last_event=f"Сохранено: №{number}, круг {rec['lap']}")


def _build_export_rows():
    if race_start_perf is None:
        return [], []

    max_laps = max((len(runners[n]["lap_times"]) for n in registered_numbers), default=0)
    header = [
        "Номер",
        "Кругов",
        "Последний круг",
        "Средний круг",
        "Лучший круг",
        "Худший круг",
        "Общее время",
        "Последняя отметка (часы)",
    ]
    for i in range(1, max_laps + 1):
        header += [f"Круг {i} (сек)", f"Круг {i} (формат)", f"Отметка круга {i} (часы)"]

    rows = []
    for number in registered_numbers:
        rec = runners[number]
        laps = rec["lap_times"]
        best = min(laps) if laps else 0.0
        worst = max(laps) if laps else 0.0
        avg = (sum(laps) / len(laps)) if laps else 0.0
        row = [
            number,
            rec["lap"],
            f"{(rec['last_lap'] or 0.0):.2f}",
            f"{avg:.2f}",
            f"{best:.2f}",
            f"{worst:.2f}",
            f"{rec['total']:.2f}",
            rec["last_wall"],
        ]
        for i in range(max_laps):
            if i < len(laps):
                lap_sec = laps[i]
                t_wall = datetime.fromtimestamp(0).strftime("%H:%M:%S")
                if i < len(rec["times"]):
                    t_wall = datetime.fromtimestamp(time.time() - (time.perf_counter() - rec["times"][i])).strftime("%H:%M:%S")
                row += [f"{lap_sec:.2f}", format_elapsed(lap_sec), t_wall]
            else:
                row += ["", "", ""]
        rows.append(row)

    return header, rows


def save_csv():
    header, rows = _build_export_rows()
    if not rows:
        messagebox.showinfo("Пусто", "Сначала нужно записать хотя бы одно событие.")
        return
    path = filedialog.asksaveasfilename(defaultextension=".csv", filetypes=[("CSV file", "*.csv")], title="Сохранить результаты")
    if not path:
        return
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)
    messagebox.showinfo("Готово", f"Результаты сохранены:\n{path}")


def add_manual_crossing():
    if not race_started:
        messagebox.showinfo("Забег не запущен", "Сначала нажми «Старт».")
        return
    pending_append((time.perf_counter(), datetime.now().strftime("%H:%M:%S")))
    set_state(pending=pending_len(), status="➕ Пересечение добавлено. Выбери номер участника.", last_event="Ручное пересечение")


def add_manual_crossing_hotkey(event=None):
    add_manual_crossing()
    return "break"


def confirm_number(event=None):
    item = pending_popleft()
    if item is None:
        messagebox.showinfo("Нет событий", "Сейчас нет ожидающего пересечения.")
        return

    number = participant_combo.get().strip()
    if number not in runners:
        messagebox.showwarning("Нужен номер", "Выбери номер участника из списка.")
        pending_append(item)
        set_state(pending=pending_len())
        return

    perf_time, wall_time_str = item
    add_event_to_runner(number, perf_time, wall_time_str)
    set_state(pending=pending_len(), status="Ожидаю следующее пересечение.")


def skip_event():
    if pending_popleft() is not None:
        set_state(pending=pending_len(), status="Событие пропущено.")
    else:
        messagebox.showinfo("Нет событий", "Нечего пропускать.")


def toggle_fullscreen(event=None):
    root.attributes("-fullscreen", not bool(root.attributes("-fullscreen")))
    return "break"


def exit_fullscreen(event=None):
    root.attributes("-fullscreen", False)
    return "break"


def maximize_window():
    try:
        root.state("zoomed")
    except Exception:
        try:
            root.attributes("-zoomed", True)
        except Exception:
            pass


def _normalize_title(s: str) -> str:
    return (s or "").strip().lower()


def find_scrcpy_hwnd():
    wanted = _normalize_title(WINDOW_TITLE)
    found = []

    def enum_handler(hwnd, _):
        try:
            if win32gui.IsWindow(hwnd) and _normalize_title(win32gui.GetWindowText(hwnd)) == wanted:
                found.append(hwnd)
        except Exception:
            pass

    win32gui.EnumWindows(enum_handler, None)
    return found[0] if found else None


def capture_hwnd(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    win_w, win_h = max(1, right - left), max(1, bottom - top)
    hwnd_dc = win32gui.GetWindowDC(hwnd)
    mfc_dc = win32ui.CreateDCFromHandle(hwnd_dc)
    save_dc = mfc_dc.CreateCompatibleDC()
    save_bitmap = win32ui.CreateBitmap()
    save_bitmap.CreateCompatibleBitmap(mfc_dc, win_w, win_h)
    save_dc.SelectObject(save_bitmap)

    try:
        result = ctypes.windll.user32.PrintWindow(hwnd, save_dc.GetSafeHdc(), PW_RENDERFULLCONTENT)
        if result != 1:
            result = ctypes.windll.user32.PrintWindow(hwnd, save_dc.GetSafeHdc(), 0)

        bmpinfo = save_bitmap.GetInfo()
        bmpstr = save_bitmap.GetBitmapBits(True)
        frame = np.frombuffer(bmpstr, dtype=np.uint8).reshape((bmpinfo["bmHeight"], bmpinfo["bmWidth"], 4))
        frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)

        if ROTATE_CAPTURE_CCW:
            frame = cv2.rotate(frame, cv2.ROTATE_90_COUNTERCLOCKWISE)
        return _apply_user_crop(frame), result == 1
    finally:
        for fn in (
            lambda: win32gui.DeleteObject(save_bitmap.GetHandle()),
            save_dc.DeleteDC,
            mfc_dc.DeleteDC,
            lambda: win32gui.ReleaseDC(hwnd, hwnd_dc),
        ):
            try:
                fn()
            except Exception:
                pass


def screen_capture_worker():
    while running:
        loop_start = time.perf_counter()
        hwnd = find_scrcpy_hwnd()
        if hwnd is None:
            set_state(status='Окно "scrcpy_cam" не найдено. Сначала запусти scrcpy.')
            time.sleep(0.25)
            continue
        try:
            frame, ok = capture_hwnd(hwnd)
            if frame is not None and frame.size > 0:
                with raw_lock:
                    raw_frames.append(frame)
                if SHOW_CAPTURE_STATUS and ok:
                    set_state(status='Захват scrcpy_cam идет.')
        except Exception:
            set_state(status='Ошибка захвата окна scrcpy_cam.')
        sleep_for = FRAME_TIME - (time.perf_counter() - loop_start)
        if sleep_for > 0:
            time.sleep(sleep_for)


def _prepare_for_processing(frame):
    h, w = frame.shape[:2]
    if w <= MAX_PROC_WIDTH:
        return frame
    scale = MAX_PROC_WIDTH / float(w)
    return cv2.resize(frame, (MAX_PROC_WIDTH, max(1, int(h * scale))), interpolation=cv2.INTER_AREA)


def _line_side(x, line_x):
    zone_left = line_x - FINISH_ZONE_WIDTH // 2
    zone_right = line_x + FINISH_ZONE_WIDTH // 2
    if x < zone_left - LINE_SIDE_MARGIN:
        return -1
    if x > zone_right + LINE_SIDE_MARGIN:
        return 1
    return 0


def _process_track_crossing(track_id, x, y, line_x):
    global last_global_trigger
    now_perf = time.perf_counter()
    st = track_states.setdefault(track_id, {
        "history": deque(maxlen=TRACK_HISTORY), "last_non_zero_side": 0, "age": 0,
        "last_cross": 0.0, "last_seen": now_perf, "inside_zone": False,
        "entered_from_left": False, "armed": True,
    })

    st["history"].append((x, y))
    st["age"] += 1
    st["last_seen"] = now_perf
    side = _line_side(x, line_x)
    prev_side = st["last_non_zero_side"]
    if side != 0:
        st["last_non_zero_side"] = side

    zone_left = line_x - FINISH_ZONE_WIDTH // 2
    zone_right = line_x + FINISH_ZONE_WIDTH // 2
    if prev_side == -1 and side == 0:
        st["inside_zone"] = True
        st["entered_from_left"] = True
        return
    if side == -1:
        st.update(inside_zone=False, entered_from_left=False, armed=True)
        return
    if side == 0:
        return

    hist_x = [pt[0] for pt in st["history"]]
    crossed = (side == 1 and st["inside_zone"] and st["entered_from_left"]) or (prev_side == -1 and side == 1) or (
        bool(hist_x) and min(hist_x) < zone_left - LINE_SIDE_MARGIN and max(hist_x) > zone_right + LINE_SIDE_MARGIN
    )
    if not crossed or not st["armed"]:
        return
    if len(st["history"]) >= 3 and st["history"][-1][0] - st["history"][0][0] < MIN_DX_FOR_CROSS:
        return
    if now_perf - st["last_cross"] < TRACK_COOLDOWN_SEC or now_perf - last_global_trigger < GLOBAL_COOLDOWN_SEC:
        return
    for t_cross, y_cross in recent_crossings:
        if now_perf - t_cross <= CROSS_DEDUP_SEC and abs(y - y_cross) <= CROSS_DEDUP_Y:
            return

    pending_append((now_perf, datetime.now().strftime("%H:%M:%S")))
    st.update(last_cross=now_perf, inside_zone=False, entered_from_left=False, armed=False)
    recent_crossings.append((now_perf, y))
    last_global_trigger = now_perf
    set_state(pending=pending_len(), status="🏁 Есть пересечение. Выбери номер участника.")


def _cleanup_track_states():
    now_perf = time.perf_counter()
    for tid in [tid for tid, s in track_states.items() if now_perf - s["last_seen"] > 2.5]:
        track_states.pop(tid, None)


def analysis_worker():
    global latest_display_frame
    last_ai_time = 0.0
    while running:
        with raw_lock:
            frame = raw_frames.popleft() if raw_frames else None
        if frame is None:
            time.sleep(0.001)
            continue

        if race_started and race_start_perf is not None:
            set_state(elapsed=format_elapsed(time.perf_counter() - race_start_perf - paused_total))
        elif race_start_perf is None:
            set_state(elapsed="00:00.00")

        proc_frame = _prepare_for_processing(frame)
        display = proc_frame.copy()
        frame_h, frame_w = display.shape[:2]
        line_x = frame_w // 2
        zl = max(0, line_x - FINISH_ZONE_WIDTH // 2)
        zr = min(frame_w - 1, line_x + FINISH_ZONE_WIDTH // 2)
        overlay = display.copy()
        cv2.rectangle(overlay, (zl, 0), (zr, frame_h), (0, 0, 255), -1)
        cv2.addWeighted(overlay, 0.16, display, 0.84, 0, display)

        if race_started:
            try:
                results = model.track(proc_frame, verbose=False, conf=CONF_THRES, classes=[0], imgsz=YOLO_IMGSZ, device=DEVICE,
                                      half=USE_HALF, persist=True, tracker="bytetrack.yaml")
            except Exception:
                results = []
            if results and results[0].boxes is not None:
                for box in results[0].boxes:
                    try:
                        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                    except Exception:
                        continue
                    if (x2 - x1) * (y2 - y1) < MIN_BBOX_AREA:
                        continue
                    tid = None
                    if getattr(box, "id", None) is not None:
                        try:
                            tid = int(box.id.item())
                        except Exception:
                            pass
                    if tid is None:
                        continue
                    _process_track_crossing(tid, (x1 + x2) // 2, (y1 + y2) // 2, line_x)
                    cv2.rectangle(display, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    draw_text(display, f"ID {tid}", x1, max(16, y1 - 6), 0.45, (80, 255, 80), 1)
            _cleanup_track_states()

        draw_text(display, "RUNNING" if race_started else "READY", 10, 25, 0.8, (0, 255, 255) if race_started else (255, 255, 255), 2)
        draw_text(display, f"Pending: {pending_len()}", 10, frame_h - 15, 0.65, (255, 255, 0), 2)

        with display_lock:
            latest_display_frame = display
        refresh_table()
        dt = time.perf_counter() - last_ai_time
        if dt < FRAME_TIME:
            time.sleep(FRAME_TIME - dt)
        last_ai_time = time.perf_counter()


def ask_participants(parent):
    result = {"ok": False, "numbers": []}
    win = tk.Toplevel(parent)
    win.title("Участники")
    win.geometry("450x240")
    win.resizable(False, False)
    win.grab_set()

    count_var = tk.IntVar(value=2)
    nums_var = tk.StringVar()

    tk.Label(win, text="Количество участников (1-12):", font=("Arial", 11, "bold")).pack(anchor="w", padx=14, pady=(14, 4))
    tk.Spinbox(win, from_=1, to=MAX_PARTICIPANTS, textvariable=count_var, width=6, font=("Arial", 12)).pack(anchor="w", padx=14)
    tk.Label(win, text="Номера через запятую (пример: 7, 15, 102):", font=("Arial", 11, "bold")).pack(anchor="w", padx=14, pady=(16, 4))
    tk.Entry(win, textvariable=nums_var, font=("Arial", 12), width=42).pack(anchor="w", padx=14)

    msg_lbl = tk.Label(win, text="", fg="#b91c1c", font=("Arial", 10))
    msg_lbl.pack(anchor="w", padx=14, pady=(8, 0))

    def submit():
        raw = [x.strip() for x in nums_var.get().split(",") if x.strip()]
        expected = int(count_var.get())
        uniq = []
        for n in raw:
            if n not in uniq:
                uniq.append(n)
        if len(uniq) != expected:
            msg_lbl.config(text=f"Нужно ровно {expected} уникальных номеров.")
            return
        result["numbers"] = uniq
        result["ok"] = True
        win.destroy()

    btns = tk.Frame(win)
    btns.pack(fill="x", padx=14, pady=14)
    tk.Button(btns, text="Отмена", command=win.destroy).pack(side="left")
    tk.Button(btns, text="Применить", command=submit, bg="#2563eb", fg="white").pack(side="right")

    parent.wait_window(win)
    return result


root = tk.Tk()
root.title("Lap Counter AI — scrcpy")
root.geometry("1400x850")
root.minsize(1200, 720)
root.configure(bg="#0f172a")

participant_setup = ask_participants(root)
if not participant_setup["ok"]:
    raise SystemExit("Ввод участников отменён")
registered_numbers = participant_setup["numbers"]

root.rowconfigure(1, weight=1)
root.columnconfigure(0, weight=1)

topbar = tk.Frame(root, bg="#111827", height=64)
topbar.grid(row=0, column=0, sticky="ew", padx=10, pady=(10, 6))
topbar.grid_propagate(False)

tk.Label(topbar, text="Счетчик кругов с ИИ", bg="#111827", fg="white", font=("Arial", 20, "bold")).pack(side="left", padx=16, pady=12)
elapsed_var = tk.StringVar(value="00:00.00")
tk.Label(topbar, textvariable=elapsed_var, bg="#111827", fg="#22c55e", font=("Arial", 22, "bold")).pack(side="right", padx=16)

body = tk.Frame(root, bg="#0f172a")
body.grid(row=1, column=0, sticky="nsew", padx=10, pady=(0, 10))
body.rowconfigure(0, weight=1)
body.columnconfigure(0, weight=3)
body.columnconfigure(1, weight=1)

left = tk.Frame(body, bg="#111827")
left.grid(row=0, column=0, sticky="nsew", padx=(0, 10))
left.rowconfigure(1, weight=1)
left.columnconfigure(0, weight=1)
right = tk.Frame(body, bg="#111827")
right.grid(row=0, column=1, sticky="nsew")
right.rowconfigure(6, weight=1)
right.columnconfigure(0, weight=1)

video_container = tk.Frame(left, bg="black")
video_container.grid(row=1, column=0, sticky="nsew", padx=12, pady=(6, 12))
video_label = tk.Label(video_container, bg="black")
video_label.pack(fill="both", expand=True)

status_var = tk.StringVar(value=state["status"])
pending_var = tk.StringVar(value="Ожидающих: 0")
last_event_var = tk.StringVar(value="Последнее: -")
for txt, var, color in [
    ("", status_var, "#e5e7eb"),
    ("", pending_var, "#facc15"),
    ("", last_event_var, "#93c5fd"),
]:
    tk.Label(right, textvariable=var, bg="#111827", fg=color, wraplength=330, justify="left", font=("Arial", 11)).pack(anchor="w", padx=14, pady=(8, 2))

btn_frame = tk.Frame(right, bg="#111827")
btn_frame.pack(fill="x", padx=14, pady=(8, 10))


def make_button(parent, text, command, bg="#2563eb"):
    return tk.Button(parent, text=text, command=command, bg=bg, fg="white", relief="flat", bd=0, font=("Arial", 11, "bold"), height=2)


make_button(btn_frame, "Старт", start_race, "#16a34a").grid(row=0, column=0, sticky="ew", padx=3, pady=3)
make_button(btn_frame, "Стоп", stop_race, "#dc2626").grid(row=0, column=1, sticky="ew", padx=3, pady=3)
make_button(btn_frame, "Сброс", reset_all, "#475569").grid(row=1, column=0, sticky="ew", padx=3, pady=3)
make_button(btn_frame, "Сохранить CSV", save_csv, "#7c3aed").grid(row=1, column=1, sticky="ew", padx=3, pady=3)
make_button(btn_frame, "Добавить пересечение", add_manual_crossing, "#f59e0b").grid(row=2, column=0, columnspan=2, sticky="ew", padx=3, pady=3)
make_button(btn_frame, "Полный экран (F11)", toggle_fullscreen, "#0ea5e9").grid(row=3, column=0, columnspan=2, sticky="ew", padx=3, pady=3)
btn_frame.columnconfigure(0, weight=1)
btn_frame.columnconfigure(1, weight=1)

entry_box = tk.Frame(right, bg="#111827")
entry_box.pack(fill="x", padx=14, pady=(0, 10))
tk.Label(entry_box, text="Выбор участника", bg="#111827", fg="white", font=("Arial", 12, "bold")).pack(anchor="w", pady=(0, 6))
participant_combo = ttk.Combobox(entry_box, values=registered_numbers, state="readonly", font=("Arial", 14))
participant_combo.pack(fill="x")
if registered_numbers:
    participant_combo.set(registered_numbers[0])
participant_combo.bind("<Return>", confirm_number)

row_btns = tk.Frame(entry_box, bg="#111827")
row_btns.pack(fill="x", pady=(8, 0))
make_button(row_btns, "Подтвердить", confirm_number, "#0891b2").pack(side="left", fill="x", expand=True, padx=(0, 6))
make_button(row_btns, "Пропустить", skip_event, "#ca8a04").pack(side="left", fill="x", expand=True, padx=(6, 0))

table_frame = tk.Frame(right, bg="#111827")
table_frame.pack(fill="both", expand=True, padx=14, pady=(4, 14))

table = ttk.Treeview(table_frame, columns=("number", "lap", "lap_time", "total_time"), show="headings", height=16)
style = ttk.Style()
style.theme_use("clam")
style.configure("Treeview", background="#0b1220", fieldbackground="#0b1220", foreground="white", rowheight=26, borderwidth=0)
style.configure("Treeview.Heading", background="#1f2937", foreground="white", font=("Arial", 10, "bold"))

table.heading("number", text="№ участника")
table.heading("lap", text="Последний круг")
table.heading("lap_time", text="Время последнего")
table.heading("total_time", text="Общее время")
table.column("number", width=100, anchor="center")
table.column("lap", width=120, anchor="center")
table.column("lap_time", width=120, anchor="center")
table.column("total_time", width=120, anchor="center")
table.pack(fill="both", expand=True)


def update_gui():
    st = get_state()
    status_var.set(st["status"])
    pending_var.set(f"Ожидающих: {st['pending']}")
    elapsed_var.set(st["elapsed"])
    last_event_var.set(f"Последнее: {st['last_event']}")

    with display_lock:
        frame = None if latest_display_frame is None else latest_display_frame.copy()
    if frame is not None:
        target_w, target_h = max(video_label.winfo_width(), 100), max(video_label.winfo_height(), 100)
        fh, fw = frame.shape[:2]
        scale = min(target_w / fw, target_h / fh)
        new_w, new_h = max(1, int(fw * scale)), max(1, int(fh * scale))
        resized = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_LINEAR)
        canvas = np.zeros((target_h, target_w, 3), dtype=np.uint8)
        xo, yo = (target_w - new_w) // 2, (target_h - new_h) // 2
        canvas[yo:yo + new_h, xo:xo + new_w] = resized
        imgtk = ImageTk.PhotoImage(image=Image.fromarray(cv2.cvtColor(canvas, cv2.COLOR_BGR2RGB)))
        video_label.imgtk = imgtk
        video_label.configure(image=imgtk, text="")
    else:
        video_label.configure(text="Ожидание видеопотока...", fg="white", image="")
    root.after(20, update_gui)


clear_session_data()
refresh_table()
root.bind("<F11>", toggle_fullscreen)
root.bind("<Escape>", exit_fullscreen)
root.bind("<Tab>", add_manual_crossing_hotkey)
threading.Thread(target=screen_capture_worker, daemon=True).start()
threading.Thread(target=analysis_worker, daemon=True).start()
root.after(20, update_gui)
root.after(100, maximize_window)


def on_close():
    global running
    running = False
    root.destroy()


root.protocol("WM_DELETE_WINDOW", on_close)
root.mainloop()
