import os
import cv2
import mediapipe as mp
import csv
import numpy as np
from transformers import pipeline
from PIL import Image
from flask import Flask, request, jsonify, Blueprint

# Initialize Flask app and Blueprint
app = Flask(__name__)
media_blueprint = Blueprint('media', __name__)

# Hugging Face Model Setup
Hugging_Face_API = os.getenv("HUGGING_FACE_MODEL")
pipe = pipeline("image-classification", model=Hugging_Face_API)

# Mediapipe Holistic and Drawing modules initialization
mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Define CSV fieldnames
fieldnames = ['file_name', 'frame', 'label', 'landmark_type', 'landmark_index', 'x', 'y', 'z']

# Video processing route
@media_blueprint.route('/process', methods=['GET'])
def process_videos():
    data = request.json
    input_directory = './videos'
    output_directory = './output_frames'
    output_file = os.path.join(output_directory, "landmarks.csv")

    # Check if the input directory exists
    if not os.path.exists(input_directory):
        return jsonify({"error": "Input directory does not exist"}), 400

    os.makedirs(output_directory, exist_ok=True)

    # Processing logic
    with open(output_file, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()

        # Initialize Mediapipe holistic model for landmark detection
        with mp_holistic.Holistic(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
            for root, _, files in os.walk(input_directory):
                folder_name = os.path.basename(root)
                for filename in files:
                    file_path = os.path.join(root, filename)
                    relative_path = os.path.relpath(root, input_directory)
                    output_subdir = os.path.join(output_directory, relative_path)
                    os.makedirs(output_subdir, exist_ok=True)

                    # Process video files
                    if filename.endswith(('.mp4', '.avi', '.mov', '.mkv')):
                        cap = cv2.VideoCapture(file_path)
                        frame_count = 0

                        while cap.isOpened():
                            ret, frame = cap.read()
                            if not ret:
                                break

                            # Process each frame and classify it
                            annotated_frame = process_frame(filename, frame_count, frame, writer, folder_name, holistic)
                            if annotated_frame is not None:
                                classify_and_delete_frame(annotated_frame)
                                frame_count += 1

                        cap.release()

                        # Clean up the processed video file from the input directory
                        if os.path.exists(file_path):
                            os.remove(file_path)
                            print(f"Deleted video file: {file_path}")

                    # Process image files
                    elif filename.endswith(('.jpg', '.jpeg', '.png', '.bmp')):
                        image = cv2.imread(file_path)
                        annotated_image = process_frame(filename, 0, image, writer, folder_name, holistic)
                        if annotated_image is not None:
                            classify_and_delete_frame(annotated_image)

                        # Clean up the processed image file from the input directory
                        if os.path.exists(file_path):
                            os.remove(file_path)
                            print(f"Deleted image file: {file_path}")

    return jsonify({"message": "Processing complete", "output_file": output_file, "output_directory": output_directory})

def process_frame(file_name, frame_count, image, writer, folder_name, holistic):
    canvas_width, canvas_height = 1920, 1080
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = holistic.process(rgb_image)
    black_canvas = np.zeros((canvas_height, canvas_width, 3), dtype=np.uint8)

    def normalize_and_draw_landmarks(landmarks, landmark_type, connections, max_landmarks):
        for i, landmark in enumerate(landmarks.landmark):
            scaled_x = int(landmark.x * canvas_width)
            scaled_y = int(landmark.y * canvas_height)
            scaled_z = landmark.z
            writer.writerow({
                'file_name': file_name,
                'frame': frame_count,
                'label': folder_name,
                'landmark_type': landmark_type,
                'landmark_index': i,
                'x': scaled_x / canvas_width,
                'y': scaled_y / canvas_height,
                'z': scaled_z
            })
        if len(landmarks.landmark) > 0:
            mp_drawing.draw_landmarks(
                black_canvas,
                landmarks,
                connections,
                mp_drawing_styles.get_default_face_mesh_tesselation_style()
            )

    # Draw and normalize landmarks for different body parts
    if results.face_landmarks:
        normalize_and_draw_landmarks(results.face_landmarks, 'face', mp_holistic.FACEMESH_TESSELATION, 468)

    if results.pose_landmarks:
        normalize_and_draw_landmarks(results.pose_landmarks, 'pose', mp_holistic.POSE_CONNECTIONS, 33)

    if results.left_hand_landmarks:
        normalize_and_draw_landmarks(results.left_hand_landmarks, 'left_hand', mp_holistic.HAND_CONNECTIONS, 21)

    if results.right_hand_landmarks:
        normalize_and_draw_landmarks(results.right_hand_landmarks, 'right_hand', mp_holistic.HAND_CONNECTIONS, 21)

    return black_canvas if np.any(black_canvas) else None

def classify_and_delete_frame(frame):
    """
    Classifies the frame using Hugging Face model and deletes the frame after processing.
    """
    try:
        # Convert the frame to an image
        pil_image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

        # Classify the frame using Hugging Face pipeline
        classifications = pipe(pil_image)
        
        # Log or handle the classification results here
        print(f"Classification results: {classifications}")

        # Delete the frame after processing
        del frame  # Remove the frame object from memory
        print(f"Frame deleted after processing.")

    except Exception as e:
        print(f"Error processing frame: {e}")

# Register the blueprint and run the app
app.register_blueprint(media_blueprint)

if __name__ == '__main__':
    app.run(debug=True)