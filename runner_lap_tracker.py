import re
import time
from collections import Counter, deque
from dataclasses import dataclass, field

import cv2
import easyocr
from ultralytics import YOLO

# === НАСТРОЙКИ ===
CAM_URL = "http://192.168.0.220:8080/video"
FRAME_SIZE = (640, 480)
LINE_X = 300

DETECTION_EVERY_N_FRAMES = 2
OCR_EVERY_N_FRAMES = 6
MODEL_IMAGE_SIZE = 320
MAX_TRACK_DISTANCE = 90
TRACK_TTL_FRAMES = 12
NUMBER_BUFFER_SIZE = 8
OCR_COOLDOWN_SEC = 0.35
EVENT_TEXT_SEC = 1.5
MIN_CONFIDENCE = 0.30
NUMBER_RANGE = range(1, 16)


@dataclass
class Track:
    track_id: int
    center_x: int
    center_y: int
    bbox: tuple[int, int, int, int]
    last_seen_frame: int
    last_ocr_time: float = 0.0
    number_votes: deque = field(default_factory=lambda: deque(maxlen=NUMBER_BUFFER_SIZE))
    lap_count: int = 0

    def best_number(self):
        if not self.number_votes:
            return None
        return Counter(self.number_votes).most_common(1)[0][0]


# === ИНИЦИАЛИЗАЦИЯ ===
model = YOLO("yolov8n.pt")
reader = easyocr.Reader(["en"], gpu=False)

cap = cv2.VideoCapture(CAM_URL)
cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

frame_count = 0
tracks: dict[int, Track] = {}
next_track_id = 0
last_event_time = 0.0
show_text = ""
last_results = []


# === УЛУЧШЕНИЕ ИЗОБРАЖЕНИЯ ===
def preprocess(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=2.0, fy=2.0, interpolation=cv2.INTER_CUBIC)
    gray = cv2.bilateralFilter(gray, 7, 50, 50)
    gray = cv2.equalizeHist(gray)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return thresh


# === OCR НОМЕРА ===
def extract_number(person_img):
    processed = preprocess(person_img)
    ocr_result = reader.readtext(processed, detail=1, paragraph=False)

    best_candidate = None
    best_conf = 0.0

    for _, text, conf in ocr_result:
        normalized = (
            text.upper()
            .replace("O", "0")
            .replace("Q", "0")
            .replace("I", "1")
            .replace("L", "1")
            .replace("Z", "2")
            .replace("S", "5")
            .replace("G", "6")
            .replace("B", "8")
            .replace("A", "4")
        )
        digits_only = re.sub(r"\D", "", normalized)
        if not digits_only:
            continue

        number = int(digits_only)
        if number in NUMBER_RANGE and conf >= MIN_CONFIDENCE and conf > best_conf:
            best_candidate = number
            best_conf = conf

    return best_candidate, best_conf, processed


def match_track(center_x, center_y):
    best_track_id = None
    best_distance = MAX_TRACK_DISTANCE + 1

    for track_id, track in tracks.items():
        distance = abs(track.center_x - center_x) + abs(track.center_y - center_y)
        if distance < best_distance and distance <= MAX_TRACK_DISTANCE:
            best_distance = distance
            best_track_id = track_id

    return best_track_id


while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    frame = cv2.resize(frame, FRAME_SIZE)
    annotated = frame.copy()
    now = time.time()

    # Запускаем детекцию не на каждом кадре, чтобы уменьшить нагрузку на CPU.
    if frame_count % DETECTION_EVERY_N_FRAMES == 0 or not last_results:
        last_results = model(frame, imgsz=MODEL_IMAGE_SIZE, verbose=False)

    seen_track_ids = set()

    for result in last_results:
        for box in result.boxes:
            if int(box.cls[0]) != 0:
                continue  # только люди

            x1, y1, x2, y2 = map(int, box.xyxy[0])
            w = x2 - x1
            h = y2 - y1
            if w < 50 or h < 100:
                continue

            center_x = (x1 + x2) // 2
            center_y = (y1 + y2) // 2
            matched_track_id = match_track(center_x, center_y)

            if matched_track_id is None:
                matched_track_id = next_track_id
                tracks[matched_track_id] = Track(
                    track_id=matched_track_id,
                    center_x=center_x,
                    center_y=center_y,
                    bbox=(x1, y1, x2, y2),
                    last_seen_frame=frame_count,
                )
                next_track_id += 1

            track = tracks[matched_track_id]
            prev_center_x = track.center_x
            track.center_x = center_x
            track.center_y = center_y
            track.bbox = (x1, y1, x2, y2)
            track.last_seen_frame = frame_count
            seen_track_ids.add(matched_track_id)

            # OCR делаем реже и только рядом с линией, чтобы ускорить обработку.
            should_read_ocr = (
                frame_count % OCR_EVERY_N_FRAMES == 0
                and abs(center_x - LINE_X) < 140
                and now - track.last_ocr_time >= OCR_COOLDOWN_SEC
            )

            if should_read_ocr:
                crop = frame[
                    y1 + int(h * 0.15): y1 + int(h * 0.75),
                    x1 + int(w * 0.2): x1 + int(w * 0.8),
                ]
                if crop.size > 0:
                    number, conf, _ = extract_number(crop)
                    if number is not None:
                        track.number_votes.append(number)
                        track.last_ocr_time = now
                        print(f"Track {track.track_id} OCR: {number} ({conf:.2f})")

            # Считаем круг только при пересечении линии слева направо для конкретного трека.
            if prev_center_x < LINE_X <= center_x:
                track.lap_count += 1
                best_number = track.best_number()
                if best_number is not None:
                    show_text = f"RUNNER {best_number} | LAP {track.lap_count}"
                else:
                    show_text = f"RUNNER ? | LAP {track.lap_count}"
                last_event_time = now

            best_number = track.best_number()
            label = f"ID {track.track_id}"
            if best_number is not None:
                label += f" | #{best_number}"
            label += f" | laps: {track.lap_count}"

            cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(
                annotated,
                label,
                (x1, max(25, y1 - 10)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.55,
                (50, 255, 50),
                2,
            )

    # Удаляем старые треки, которые пропали из кадра.
    stale_track_ids = [
        track_id
        for track_id, track in tracks.items()
        if frame_count - track.last_seen_frame > TRACK_TTL_FRAMES
    ]
    for track_id in stale_track_ids:
        del tracks[track_id]

    cv2.line(annotated, (LINE_X, 0), (LINE_X, FRAME_SIZE[1]), (0, 0, 255), 2)

    if now - last_event_time < EVENT_TEXT_SEC:
        cv2.putText(
            annotated,
            show_text,
            (30, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.9,
            (0, 0, 255),
            2,
        )

    cv2.imshow("Race AI OCR BOOST", annotated)

    if cv2.waitKey(1) == 27:
        break

cap.release()
cv2.destroyAllWindows()
