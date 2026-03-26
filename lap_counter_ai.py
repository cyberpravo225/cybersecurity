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

# =========================
# НАСТРОЙКИ
# =========================
WINDOW_TITLE = "scrcpy_cam"
MODEL_NAME = "yolov8n.pt"

# Отрисовка в UI без искажений
VIEW_W = 960
VIEW_H = 540

# Производительность
TARGET_FPS = 30
FRAME_TIME = 1.0 / TARGET_FPS
MAX_PROC_WIDTH = 1200

CONF_THRES = 0.30
MIN_BBOX_AREA = 1500
COOLDOWN_SEC = 0.35

# Трекинг
MATCH_DIST_X = 120
MATCH_DIST_Y = 120
MIN_TRACK_AGE = 2
MIN_DX_FOR_CROSS = 6
TRACK_STALE_FRAMES = 10
LINE_SIDE_MARGIN = 10
TRACK_HISTORY = 8
FINISH_ZONE_WIDTH = 80

# Если scrcpy уже повернут правильно, поставь False
ROTATE_CAPTURE_CCW = True
SHOW_CAPTURE_STATUS = True

# =========================
# УСКОРЕНИЕ OPENCV
# =========================
cv2.setUseOptimized(True)
cv2.setNumThreads(max(1, os.cpu_count() // 2))

# =========================
# МОДЕЛЬ
# =========================
model = YOLO(MODEL_NAME)

try:
    import torch

    USE_CUDA = torch.cuda.is_available()
except Exception:
    USE_CUDA = False

DEVICE = 0 if USE_CUDA else "cpu"
USE_HALF = bool(USE_CUDA)
YOLO_IMGSZ = 640 if USE_CUDA else 448

# =========================
# DPI FIX ДЛЯ WINDOWS
# =========================
if os.name == "nt":
    try:
        ctypes.windll.user32.SetProcessDPIAware()
    except Exception:
        pass

PW_RENDERFULLCONTENT = 0x00000002

# =========================
# СОСТОЯНИЕ
# =========================
running = True

race_started = False
race_start_perf = None
paused_at = None
paused_total = 0.0

raw_lock = threading.Lock()
raw_frames = deque(maxlen=6)

display_lock = threading.Lock()
latest_display_frame = None

pending_lock = threading.Lock()
pending_events = deque()  # [(perf_time, wall_time_str), ...]

events = []
runners = {}
last_global_trigger = 0.0

tracks = {}
next_track_id = 1
frame_index = 0
track_states = {}

state_lock = threading.Lock()
state = {
    "status": "Нажми «Старт», чтобы начать забег.",
    "pending": 0,
    "elapsed": "00:00.00",
    "last_event": "-",
}


# =========================
# ВСПОМОГАТЕЛЬНОЕ
# =========================
def format_elapsed(seconds: float) -> str:
    m = int(seconds // 60)
    s = seconds % 60
    return f"{m:02d}:{s:05.2f}"


def crossed_left_to_right(prev_x, curr_x, line_x):
    return prev_x < line_x <= curr_x


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
        if pending_events:
            return pending_events.popleft()
        return None


def pending_len():
    with pending_lock:
        return len(pending_events)


def clear_session_data():
    global race_start_perf, paused_at, paused_total, last_global_trigger
    global tracks, next_track_id, frame_index, track_states

    with pending_lock:
        pending_events.clear()
    with raw_lock:
        raw_frames.clear()

    events.clear()
    runners.clear()
    tracks = {}
    track_states = {}
    next_track_id = 1
    frame_index = 0
    last_global_trigger = 0.0

    race_start_perf = None
    paused_at = None
    paused_total = 0.0


# =========================
# ТАЙМЕР / СЕССИЯ
# =========================
def start_race():
    global race_started, race_start_perf, paused_at, paused_total

    if race_started:
        messagebox.showinfo("Уже идет", "Забег уже запущен.")
        return

    now = time.perf_counter()

    if race_start_perf is None:
        if events or runners or pending_len() > 0:
            if not messagebox.askyesno("Новая сессия", "Есть старые данные. Начать новый забег и очистить их?"):
                return
            clear_session_data()
        race_start_perf = now
        paused_total = 0.0
        paused_at = None
    else:
        if paused_at is not None:
            paused_total += now - paused_at
            paused_at = None

    race_started = True
    refresh_table()
    set_state(
        status="Забег идет. Жду пересечение слева направо.",
        pending=pending_len(),
        elapsed="00:00.00",
        last_event="Старт"
    )


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
    set_state(
        status="Всё очищено. Нажми «Старт».",
        pending=0,
        elapsed="00:00.00",
        last_event="-"
    )


# =========================
# РЕЗУЛЬТАТЫ
# =========================
def refresh_table():
    for item in table.get_children():
        table.delete(item)
    for row in events[-300:]:
        table.insert("", "end", values=row)


def add_event_to_runner(number, perf_time, wall_time_str):
    number = str(number).strip()
    if not number:
        return

    if race_start_perf is None:
        return

    if number not in runners:
        runners[number] = []

    runners[number].append(perf_time)
    lap_count = len(runners[number])

    if lap_count == 1:
        lap_label = "1"
        lap_time = perf_time - race_start_perf - paused_total
        total_time = lap_time
    else:
        lap_label = str(lap_count)
        lap_time = runners[number][-1] - runners[number][-2]
        total_time = runners[number][-1] - race_start_perf - paused_total

    row = (
        wall_time_str,
        number,
        lap_label,
        f"{lap_time:.2f}",
        f"{total_time:.2f}",
    )
    events.append(row)
    refresh_table()
    set_state(last_event=f"Сохранено: №{number}, круг {lap_label}")


def _build_export_rows():
    if race_start_perf is None:
        return [], []

    rows = []
    for number, times in runners.items():
        if not times:
            continue
        lap_times = []
        for i, t in enumerate(times):
            if i == 0:
                lap_times.append(t - race_start_perf - paused_total)
            else:
                lap_times.append(t - times[i - 1])

        total_time = times[-1] - race_start_perf - paused_total
        rows.append({
            "number": str(number),
            "surname": "",
            "total": total_time,
            "laps": lap_times,
        })

    rows.sort(key=lambda x: x["total"])
    for idx, row in enumerate(rows, start=1):
        row["place"] = idx

    max_laps = max((len(r["laps"]) for r in rows), default=0)
    header = ["Номер", "Фамилия", "Общее время, сек", "Место"] + [f"Круг {i}, сек" for i in range(1, max_laps + 1)]

    output_rows = []
    for r in rows:
        lap_values = [f"{v:.2f}" for v in r["laps"]]
        lap_values += [""] * (max_laps - len(lap_values))
        output_rows.append([
            r["number"],
            r["surname"],
            f"{r['total']:.2f}",
            str(r["place"]),
            *lap_values,
        ])

    return header, output_rows


def save_csv():
    header, rows = _build_export_rows()
    if not rows:
        messagebox.showinfo("Пусто", "Сначала нужно записать хотя бы одно событие.")
        return

    path = filedialog.asksaveasfilename(
        defaultextension=".csv",
        filetypes=[("CSV file", "*.csv")],
        title="Сохранить результаты"
    )
    if not path:
        return

    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)

    messagebox.showinfo("Готово", f"Результаты сохранены:\n{path}")


# =========================
# КНОПКИ СОБЫТИЙ
# =========================
def add_manual_crossing():
    if not race_started:
        messagebox.showinfo("Забег не запущен", "Сначала нажми «Старт».")
        return

    now_perf = time.perf_counter()
    wall_time_str = datetime.now().strftime("%H:%M:%S")
    pending_append((now_perf, wall_time_str))
    set_state(
        pending=pending_len(),
        status="➕ Пересечение добавлено вручную. Введи номер участника.",
        last_event="Ручное пересечение"
    )


def add_manual_crossing_hotkey(event=None):
    add_manual_crossing()
    return "break"


def confirm_number(event=None):
    item = pending_popleft()
    if item is None:
        messagebox.showinfo("Нет событий", "Сейчас нет ожидающего пересечения.")
        return

    number = number_entry.get().strip()
    if not number:
        messagebox.showwarning("Нужен номер", "Введи номер участника.")
        pending_append(item)
        set_state(pending=pending_len())
        return

    perf_time, wall_time_str = item
    add_event_to_runner(number, perf_time, wall_time_str)

    number_entry.delete(0, tk.END)
    set_state(pending=pending_len(), status="Ожидаю следующее пересечение слева направо.")


def skip_event():
    item = pending_popleft()
    if item is not None:
        set_state(pending=pending_len(), status="Событие пропущено.")
    else:
        messagebox.showinfo("Нет событий", "Нечего пропускать.")


# =========================
# ПОЛНОЭКРАННЫЙ РЕЖИМ
# =========================
def toggle_fullscreen(event=None):
    current = bool(root.attributes("-fullscreen"))
    root.attributes("-fullscreen", not current)
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


# =========================
# ПОИСК ОКНА scrcpy
# =========================
def _normalize_title(s: str) -> str:
    return (s or "").strip().lower()


def find_scrcpy_hwnd():
    wanted = _normalize_title(WINDOW_TITLE)
    found = []

    def enum_handler(hwnd, _):
        try:
            if not win32gui.IsWindow(hwnd):
                return
            title = _normalize_title(win32gui.GetWindowText(hwnd))
            if title != wanted:
                return
            found.append(hwnd)
        except Exception:
            pass

    win32gui.EnumWindows(enum_handler, None)
    return found[0] if found else None


def capture_hwnd(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    win_w = max(1, right - left)
    win_h = max(1, bottom - top)

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
        frame = np.frombuffer(bmpstr, dtype=np.uint8)
        frame = frame.reshape((bmpinfo["bmHeight"], bmpinfo["bmWidth"], 4))
        frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)

        try:
            client_left_top = win32gui.ClientToScreen(hwnd, (0, 0))
            client_rect = win32gui.GetClientRect(hwnd)
            client_w = client_rect[2]
            client_h = client_rect[3]
            client_right_bottom = win32gui.ClientToScreen(hwnd, (client_w, client_h))

            x1 = max(0, client_left_top[0] - left)
            y1 = max(0, client_left_top[1] - top)
            x2 = min(win_w, client_right_bottom[0] - left)
            y2 = min(win_h, client_right_bottom[1] - top)

            if x2 > x1 and y2 > y1:
                cropped = frame[y1:y2, x1:x2]
                if cropped.size > 0:
                    frame = cropped
        except Exception:
            pass

        if ROTATE_CAPTURE_CCW:
            frame = cv2.rotate(frame, cv2.ROTATE_90_COUNTERCLOCKWISE)

        return frame, result == 1
    finally:
        try:
            win32gui.DeleteObject(save_bitmap.GetHandle())
        except Exception:
            pass
        try:
            save_dc.DeleteDC()
        except Exception:
            pass
        try:
            mfc_dc.DeleteDC()
        except Exception:
            pass
        try:
            win32gui.ReleaseDC(hwnd, hwnd_dc)
        except Exception:
            pass


# =========================
# ЗАХВАТ
# =========================
def screen_capture_worker():
    last_missing_status = 0.0
    last_fail_status = 0.0

    while running:
        loop_start = time.perf_counter()
        hwnd = find_scrcpy_hwnd()

        if hwnd is None:
            now = time.perf_counter()
            if now - last_missing_status > 1.5:
                set_state(status='Окно "scrcpy_cam" не найдено. Сначала запусти scrcpy.')
                last_missing_status = now
            time.sleep(0.25)
            continue

        try:
            frame, ok = capture_hwnd(hwnd)
            if frame is None or frame.size == 0:
                now = time.perf_counter()
                if now - last_fail_status > 1.5:
                    set_state(status='Не удалось получить кадр из scrcpy_cam.')
                    last_fail_status = now
                time.sleep(0.05)
                continue

            with raw_lock:
                raw_frames.append(frame)

            if SHOW_CAPTURE_STATUS and ok:
                set_state(status='Захват scrcpy_cam идет.')

        except Exception:
            now = time.perf_counter()
            if now - last_fail_status > 1.5:
                set_state(status='Ошибка захвата окна scrcpy_cam.')
                last_fail_status = now

        elapsed = time.perf_counter() - loop_start
        sleep_for = FRAME_TIME - elapsed
        if sleep_for > 0:
            time.sleep(sleep_for)


# =========================
# АНАЛИЗ / ТРЕКИНГ
# =========================
def _prepare_for_processing(frame):
    h, w = frame.shape[:2]
    if w <= MAX_PROC_WIDTH:
        return frame, 1.0
    scale = MAX_PROC_WIDTH / float(w)
    new_h = max(1, int(h * scale))
    resized = cv2.resize(frame, (MAX_PROC_WIDTH, new_h), interpolation=cv2.INTER_AREA)
    return resized, scale


def _match_tracks(detections):
    global tracks, next_track_id, frame_index

    frame_index += 1
    track_ids = list(tracks.keys())
    used_tracks = set()
    used_det = set()

    matches = []
    for di, d in enumerate(detections):
        best_tid = None
        best_score = None
        for tid in track_ids:
            if tid in used_tracks:
                continue
            tr = tracks[tid]
            dx = abs(d["x"] - tr["x"])
            dy = abs(d["y"] - tr["y"])
            if dx <= MATCH_DIST_X and dy <= MATCH_DIST_Y:
                score = dx + dy
                if best_score is None or score < best_score:
                    best_score = score
                    best_tid = tid
        if best_tid is not None:
            used_tracks.add(best_tid)
            used_det.add(di)
            matches.append((best_tid, di))

    for tid, di in matches:
        tr = tracks[tid]
        d = detections[di]
        tr["prev_x"] = tr["x"]
        tr["prev_y"] = tr["y"]
        tr["x"] = d["x"]
        tr["y"] = d["y"]
        tr["bbox"] = d["bbox"]
        tr["last_seen"] = frame_index
        tr["age"] += 1

    for di, d in enumerate(detections):
        if di in used_det:
            continue
        tracks[next_track_id] = {
            "x": d["x"],
            "y": d["y"],
            "prev_x": d["x"],
            "prev_y": d["y"],
            "bbox": d["bbox"],
            "last_seen": frame_index,
            "age": 1,
            "last_cross": 0.0,
        }
        next_track_id += 1

    stale = [tid for tid, tr in tracks.items() if frame_index - tr["last_seen"] > TRACK_STALE_FRAMES]
    for tid in stale:
        tracks.pop(tid, None)


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
    st = track_states.get(track_id)
    if st is None:
        st = {
            "history": deque(maxlen=TRACK_HISTORY),
            "last_non_zero_side": 0,
            "age": 0,
            "last_cross": 0.0,
            "last_seen": now_perf,
            "inside_zone": False,
            "entered_from_left": False,
        }
        track_states[track_id] = st

    st["history"].append((x, y))
    st["age"] += 1
    st["last_seen"] = now_perf

    side = _line_side(x, line_x)
    prev_side = st["last_non_zero_side"]
    if side != 0:
        st["last_non_zero_side"] = side

    if st["age"] < MIN_TRACK_AGE:
        return

    # Логика "зоны": нужно реально зайти в зону с левой стороны и выйти справа.
    if prev_side == -1 and side == 0:
        st["inside_zone"] = True
        st["entered_from_left"] = True
        return
    if side == -1:
        st["inside_zone"] = False
        st["entered_from_left"] = False
        return
    if side == 0:
        return
    if not (side == 1 and st["inside_zone"] and st["entered_from_left"]):
        return

    # Средний сдвиг по истории для устойчивости в плотной группе.
    if len(st["history"]) >= 3:
        dx_total = st["history"][-1][0] - st["history"][0][0]
        if dx_total < MIN_DX_FOR_CROSS:
            return

    if now_perf - st["last_cross"] < COOLDOWN_SEC:
        return
    if now_perf - last_global_trigger < COOLDOWN_SEC:
        return

    wall_time_str = datetime.now().strftime("%H:%M:%S")
    pending_append((now_perf, wall_time_str))
    st["last_cross"] = now_perf
    st["inside_zone"] = False
    st["entered_from_left"] = False
    last_global_trigger = now_perf
    set_state(
        pending=pending_len(),
        status="🏁 Есть пересечение слева направо. Введи номер участника.",
    )


def _cleanup_track_states():
    now_perf = time.perf_counter()
    stale_ids = [tid for tid, s in track_states.items() if now_perf - s["last_seen"] > 2.5]
    for tid in stale_ids:
        track_states.pop(tid, None)


def analysis_worker():
    global latest_display_frame, last_global_trigger

    last_ai_time = 0.0

    while running:
        with raw_lock:
            frame = raw_frames.popleft() if raw_frames else None

        if frame is None:
            time.sleep(0.001)
            continue

        if race_started and race_start_perf is not None:
            now = time.perf_counter()
            elapsed = now - race_start_perf - paused_total
            set_state(elapsed=format_elapsed(elapsed))
        elif race_start_perf is None:
            set_state(elapsed="00:00.00")

        proc_frame, _ = _prepare_for_processing(frame)
        display = proc_frame.copy()
        frame_h, frame_w = display.shape[:2]
        line_x = frame_w // 2
        zone_left = max(0, line_x - FINISH_ZONE_WIDTH // 2)
        zone_right = min(frame_w - 1, line_x + FINISH_ZONE_WIDTH // 2)

        overlay = display.copy()
        cv2.rectangle(overlay, (zone_left, 0), (zone_right, frame_h), (0, 0, 255), -1)
        cv2.addWeighted(overlay, 0.16, display, 0.84, 0, display)
        cv2.line(display, (zone_left, 0), (zone_left, frame_h), (0, 0, 255), 2)
        cv2.line(display, (zone_right, 0), (zone_right, frame_h), (0, 0, 255), 2)
        draw_text(display, "FINISH ZONE", zone_right + 8, 25, 0.7, (0, 0, 255), 2)

        detections = []
        if race_started:
            try:
                results = model.track(
                    proc_frame,
                    verbose=False,
                    conf=CONF_THRES,
                    classes=[0],
                    imgsz=YOLO_IMGSZ,
                    device=DEVICE,
                    half=USE_HALF,
                    persist=True,
                    tracker="bytetrack.yaml",
                )
            except Exception:
                results = []

            if results and len(results) > 0 and results[0].boxes is not None:
                for box in results[0].boxes:
                    try:
                        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                    except Exception:
                        continue

                    area = (x2 - x1) * (y2 - y1)
                    if area < MIN_BBOX_AREA:
                        continue

                    center_x = (x1 + x2) // 2
                    center_y = (y1 + y2) // 2
                    track_id = None
                    if getattr(box, "id", None) is not None:
                        try:
                            track_id = int(box.id.item())
                        except Exception:
                            track_id = None
                    detections.append({
                        "x": center_x,
                        "y": center_y,
                        "bbox": (x1, y1, x2, y2),
                        "track_id": track_id,
                    })

            has_ids = any(d.get("track_id") is not None for d in detections)
            if has_ids:
                for d in detections:
                    tid = d.get("track_id")
                    if tid is None:
                        continue
                    _process_track_crossing(tid, d["x"], d["y"], line_x)
                    x1, y1, x2, y2 = d["bbox"]
                    cv2.rectangle(display, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    draw_text(display, f"ID {tid}", x1, max(16, y1 - 6), 0.45, (80, 255, 80), 1)
            else:
                # Фоллбек, если tracker не выдал id.
                _match_tracks(detections)
                for tid, tr in tracks.items():
                    _process_track_crossing(tid, tr["x"], tr["y"], line_x)
                    x1, y1, x2, y2 = tr["bbox"]
                    cv2.rectangle(display, (x1, y1), (x2, y2), (0, 255, 0), 2)

            _cleanup_track_states()

        draw_text(display, "RUNNING" if race_started else "READY", 10, 25, 0.8, (0, 255, 255) if race_started else (255, 255, 255), 2)
        draw_text(display, f"Pending: {pending_len()}", 10, frame_h - 15, 0.65, (255, 255, 0), 2)

        with display_lock:
            latest_display_frame = display

        now = time.perf_counter()
        dt = now - last_ai_time
        if dt < FRAME_TIME:
            time.sleep(FRAME_TIME - dt)
        last_ai_time = time.perf_counter()


# =========================
# GUI
# =========================
root = tk.Tk()
root.title("Lap Counter AI — scrcpy")
root.geometry("1400x850")
root.minsize(1200, 720)
root.configure(bg="#0f172a")

root.rowconfigure(1, weight=1)
root.columnconfigure(0, weight=1)

topbar = tk.Frame(root, bg="#111827", height=64)
topbar.grid(row=0, column=0, sticky="ew", padx=10, pady=(10, 6))
topbar.grid_propagate(False)

title = tk.Label(topbar, text="Счетчик кругов с ИИ", bg="#111827", fg="white", font=("Arial", 20, "bold"))
title.pack(side="left", padx=16, pady=12)

elapsed_var = tk.StringVar(value="00:00.00")
elapsed_label = tk.Label(topbar, textvariable=elapsed_var, bg="#111827", fg="#22c55e", font=("Arial", 22, "bold"))
elapsed_label.pack(side="right", padx=16)

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

video_title = tk.Label(left, text="Видео из scrcpy", bg="#111827", fg="white", font=("Arial", 13, "bold"))
video_title.grid(row=0, column=0, sticky="w", padx=12, pady=(10, 4))

video_container = tk.Frame(left, bg="black")
video_container.grid(row=1, column=0, sticky="nsew", padx=12, pady=(0, 12))

video_label = tk.Label(video_container, bg="black")
video_label.pack(fill="both", expand=True)

panel_title = tk.Label(right, text="Управление", bg="#111827", fg="white", font=("Arial", 16, "bold"))
panel_title.grid(row=0, column=0, sticky="w", padx=14, pady=(12, 10))

status_var = tk.StringVar(value=state["status"])
pending_var = tk.StringVar(value="Ожидающих: 0")
last_event_var = tk.StringVar(value="Последнее: -")

status_lbl = tk.Label(right, textvariable=status_var, bg="#111827", fg="#e5e7eb", wraplength=330, justify="left", font=("Arial", 11))
status_lbl.grid(row=1, column=0, sticky="ew", padx=14, pady=(0, 8))

pending_lbl = tk.Label(right, textvariable=pending_var, bg="#111827", fg="#facc15", font=("Arial", 11, "bold"))
pending_lbl.grid(row=2, column=0, sticky="w", padx=14, pady=(0, 4))

last_event_lbl = tk.Label(right, textvariable=last_event_var, bg="#111827", fg="#93c5fd", font=("Arial", 11))
last_event_lbl.grid(row=3, column=0, sticky="w", padx=14, pady=(0, 10))

btn_frame = tk.Frame(right, bg="#111827")
btn_frame.grid(row=4, column=0, sticky="ew", padx=14, pady=(0, 12))
btn_frame.columnconfigure(0, weight=1)
btn_frame.columnconfigure(1, weight=1)


def make_button(parent, text, command, bg="#2563eb", fg="white"):
    return tk.Button(
        parent,
        text=text,
        command=command,
        bg=bg,
        fg=fg,
        activebackground=bg,
        activeforeground=fg,
        relief="flat",
        bd=0,
        font=("Arial", 11, "bold"),
        height=2,
        cursor="hand2",
    )


btn_start = make_button(btn_frame, "Старт", start_race, bg="#16a34a")
btn_start.grid(row=0, column=0, sticky="ew", padx=(0, 6), pady=(0, 8))

btn_stop = make_button(btn_frame, "Стоп", stop_race, bg="#dc2626")
btn_stop.grid(row=0, column=1, sticky="ew", padx=(6, 0), pady=(0, 8))

btn_reset = make_button(btn_frame, "Сброс", reset_all, bg="#475569")
btn_reset.grid(row=1, column=0, sticky="ew", padx=(0, 6), pady=(0, 8))

btn_save = make_button(btn_frame, "Сохранить CSV", save_csv, bg="#7c3aed")
btn_save.grid(row=1, column=1, sticky="ew", padx=(6, 0), pady=(0, 8))

btn_manual = make_button(btn_frame, "Добавить пересечение", add_manual_crossing, bg="#f59e0b")
btn_manual.grid(row=2, column=0, columnspan=2, sticky="ew", pady=(0, 8))

btn_full = make_button(btn_frame, "Полный экран (F11)", toggle_fullscreen, bg="#0ea5e9")
btn_full.grid(row=3, column=0, columnspan=2, sticky="ew", pady=(0, 2))

entry_box = tk.Frame(right, bg="#111827")
entry_box.grid(row=5, column=0, sticky="new", padx=14, pady=(0, 10))

entry_label = tk.Label(entry_box, text="Номер участника", bg="#111827", fg="white", font=("Arial", 12, "bold"))
entry_label.pack(anchor="w", pady=(0, 6))

number_entry = tk.Entry(entry_box, font=("Arial", 18), bg="#0b1220", fg="white", insertbackground="white", relief="flat")
number_entry.pack(fill="x", ipady=8)
number_entry.bind("<Return>", confirm_number)

entry_btns = tk.Frame(entry_box, bg="#111827")
entry_btns.pack(fill="x", pady=(8, 0))

confirm_btn = make_button(entry_btns, "Подтвердить", confirm_number, bg="#0891b2")
confirm_btn.pack(side="left", fill="x", expand=True, padx=(0, 6))

skip_btn = make_button(entry_btns, "Пропустить", skip_event, bg="#ca8a04")
skip_btn.pack(side="left", fill="x", expand=True, padx=(6, 0))

table_frame = tk.Frame(right, bg="#111827")
table_frame.grid(row=6, column=0, sticky="nsew", padx=14, pady=(0, 14))
table_frame.rowconfigure(1, weight=1)
table_frame.columnconfigure(0, weight=1)

table_label = tk.Label(table_frame, text="События", bg="#111827", fg="white", font=("Arial", 12, "bold"))
table_label.grid(row=0, column=0, sticky="w", pady=(0, 6))

table = ttk.Treeview(table_frame, columns=("time", "number", "lap", "lap_time", "total_time"), show="headings", height=16)

style = ttk.Style()
style.theme_use("clam")
style.configure("Treeview", background="#0b1220", fieldbackground="#0b1220", foreground="white", rowheight=26, borderwidth=0)
style.configure("Treeview.Heading", background="#1f2937", foreground="white", font=("Arial", 10, "bold"))

table.heading("time", text="Время")
table.heading("number", text="№")
table.heading("lap", text="Круг")
table.heading("lap_time", text="Круг, сек")
table.heading("total_time", text="Общее, сек")

table.column("time", width=92, anchor="center")
table.column("number", width=50, anchor="center")
table.column("lap", width=50, anchor="center")
table.column("lap_time", width=80, anchor="center")
table.column("total_time", width=86, anchor="center")

table.grid(row=1, column=0, sticky="nsew")


# =========================
# ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
# =========================
def update_gui():
    st = get_state()
    status_var.set(st["status"])
    pending_var.set(f"Ожидающих: {st['pending']}")
    elapsed_var.set(st["elapsed"])
    last_event_var.set(f"Последнее: {st['last_event']}")

    with display_lock:
        frame = None if latest_display_frame is None else latest_display_frame.copy()

    if frame is not None:
        target_w = video_label.winfo_width()
        target_h = video_label.winfo_height()
        if target_w < 100 or target_h < 100:
            target_w, target_h = VIEW_W, VIEW_H

        fh, fw = frame.shape[:2]
        scale = min(target_w / fw, target_h / fh)
        new_w = max(1, int(fw * scale))
        new_h = max(1, int(fh * scale))

        resized = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_LINEAR)
        canvas = np.zeros((target_h, target_w, 3), dtype=np.uint8)
        x_offset = (target_w - new_w) // 2
        y_offset = (target_h - new_h) // 2
        canvas[y_offset:y_offset + new_h, x_offset:x_offset + new_w] = resized

        rgb = cv2.cvtColor(canvas, cv2.COLOR_BGR2RGB)
        img = Image.fromarray(rgb)
        imgtk = ImageTk.PhotoImage(image=img)
        video_label.imgtk = imgtk
        video_label.configure(image=imgtk, text="")
    else:
        video_label.configure(text="Ожидание видеопотока...", fg="white", image="")

    root.after(15, update_gui)


# =========================
# ЗАПУСК
# =========================
root.bind("<F11>", toggle_fullscreen)
root.bind("<Escape>", exit_fullscreen)
root.bind("<Tab>", add_manual_crossing_hotkey)

threading.Thread(target=screen_capture_worker, daemon=True).start()
threading.Thread(target=analysis_worker, daemon=True).start()
root.after(15, update_gui)
root.after(100, maximize_window)


def on_close():
    global running
    running = False
    root.destroy()


root.protocol("WM_DELETE_WINDOW", on_close)
number_entry.focus_set()
root.mainloop()
