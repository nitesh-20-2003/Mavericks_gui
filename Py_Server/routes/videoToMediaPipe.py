import cv2
import mediapipe as mp
import csv
import os
import numpy as np
# Directories
input_directory = r"/home/nitesh/Mavericks_gui/my-project/Py_Server/videos"
output_directory = r"/home/nitesh/Mavericks_gui/my-project/Py_Server/outputs"
output_file = "landmarks.csv"

# Create output directory if it doesn't exist
os.makedirs(output_directory, exist_ok=True)

# Initialize Mediapipe Holistic and Drawing modules
mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Define fieldnames for the CSV output
fieldnames = ['file_name', 'frame', 'label', 'landmark_type', 'landmark_index', 'x', 'y', 'z']

# Helper function to process a single frame and save landmarks
def process_frame(file_name, frame_count, image, writer, folder_name):
    canvas_width, canvas_height = 1920, 1080
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = holistic.process(rgb_image)
    frame_landmarks = {"label": folder_name, "filename": file_name, "landmarks": []}
    black_canvas = np.zeros((canvas_height, canvas_width, 3), dtype=np.uint8)

    def normalize_and_draw_landmarks(landmarks, landmark_type, connections, max_landmarks, style=None):
        landmark_data = []
        for i, landmark in enumerate(landmarks.landmark):
            scaled_x = int(landmark.x * canvas_width)
            scaled_y = int(landmark.y * canvas_height)
            scaled_z = landmark.z
            single_landmark = {
                'file_name': file_name,
                'frame': frame_count,
                'label': folder_name,
                'landmark_type': landmark_type,
                'landmark_index': i,
                'x': scaled_x / canvas_width,
                'y': scaled_y / canvas_height,
                'z': scaled_z
            }
            landmark_data.append(single_landmark)
            frame_landmarks['landmarks'].append(single_landmark)

        while len(landmark_data) < max_landmarks:
            landmark_data.append({
                'file_name': file_name,
                'frame': frame_count,
                'landmark_type': landmark_type,
                'landmark_index': len(landmark_data),
                'x': 0.0,
                'y': 0.0,
                'z': 0.0
            })
            frame_landmarks['landmarks'].append(landmark_data[-1])

        for landmark in landmark_data:
            writer.writerow(landmark)

        if len(landmarks.landmark) > 0:
            mp_drawing.draw_landmarks(
                black_canvas,
                landmarks,
                connections,
                style or mp_drawing.DrawingSpec()
            )

    max_pose_landmarks = 33
    max_face_landmarks = 468
    landmarks_detected = False

    if results.face_landmarks:
        landmarks_detected = True
        normalize_and_draw_landmarks(
            results.face_landmarks,
            'face',
            mp_holistic.FACEMESH_TESSELATION,
            max_face_landmarks,
            mp_drawing_styles.get_default_face_mesh_tesselation_style()
        )

    if results.pose_landmarks:
        normalize_and_draw_landmarks(
            results.pose_landmarks,
            'pose',
            mp_holistic.POSE_CONNECTIONS,
            max_pose_landmarks,
            mp_drawing_styles.get_default_pose_landmarks_style()
        )

    if results.left_hand_landmarks:
        normalize_and_draw_landmarks(
            results.left_hand_landmarks,
            'left_hand',
            mp_holistic.HAND_CONNECTIONS,
            21
        )

    if results.right_hand_landmarks:
        normalize_and_draw_landmarks(
            results.right_hand_landmarks,
            'right_hand',
            mp_holistic.HAND_CONNECTIONS,
            21
        )

    return (black_canvas, frame_landmarks) if landmarks_detected else (None, None)

with open(output_file, mode='w', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()

    with mp_holistic.Holistic(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        for root, _, files in os.walk(input_directory):
            folder_name = os.path.basename(root)
            for filename in files:
                file_path = os.path.join(root, filename)
                relative_path = os.path.relpath(root, input_directory)
                output_subdir = os.path.join(output_directory, relative_path)
                os.makedirs(output_subdir, exist_ok=True)

                if filename.endswith(('.mp4', '.avi', '.mov', '.mkv')):
                    cap = cv2.VideoCapture(file_path)
                    frame_count = 0

                    while cap.isOpened():
                        ret, frame = cap.read()
                        if not ret:
                            break

                        frame_file_path = os.path.join(output_subdir, f"{os.path.splitext(filename)[0]}_frame_{frame_count:05d}.jpg")
                        annotated_frame, frame_landmarks = process_frame(filename, frame_count, frame, writer, folder_name)
                        if annotated_frame is not None:
                            cv2.imwrite(frame_file_path, annotated_frame)
                            frame_count += 1

                    cap.release()

                elif filename.endswith(('.jpg', '.jpeg', '.png', '.bmp')):
                    image = cv2.imread(file_path)
                    annotated_image, frame_landmarks = process_frame(filename, 0, image, writer, folder_name)
                    if annotated_image is not None:
                        output_path = os.path.join(output_subdir, filename)
                        cv2.imwrite(output_path, annotated_image)

print("Landmarks extraction and frame storage complete. Data saved in 'landmarks.csv' and individual frames in the output directory.")