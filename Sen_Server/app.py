import os
import io
import base64
import cv2
import mediapipe as mp
import math
import numpy as np
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from transformers import pipeline
from PIL import Image
from threading import Lock
import csv
import time
# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Initialize Flask-SocketIO
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")

# Load Hugging Face model
print("Loading Hugging Face model...")
model2=pipeline("image-classification", model="parasahuja23/vit-base-patch16-224-in21k-ISL-2.0_final_on_new_words")
print("Model loaded successfully!")

# MediaPipe setup
mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Thread safety lock for processing frames
frame_lock = Lock()

# Black canvas dimensions
CANVAS_WIDTH = 1920
CANVAS_HEIGHT = 1080

# Path to save facial feature logs
CSV_FILE = "facial_features_log.csv"

# Directory to save output frames
OUTPUT_DIR = "output_frames"
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Helper functions for geometric calculations
def calculate_distance(point1, point2):
    return math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2)

def calculate_angle(point1, point2, point3):
    a = calculate_distance(point2, point3)
    b = calculate_distance(point1, point3)
    c = calculate_distance(point1, point2)
    if a * b == 0:  # Prevent division by zero
        return 0
    angle = math.acos((a**2 + b**2 - c**2) / (2 * a * b))
    return math.degrees(angle)

# Analyze facial landmarks
def analyze_face(face_landmarks, image_width, image_height):
    def get_landmark(landmark_index):
        x = face_landmarks.landmark[landmark_index].x * image_width
        y = face_landmarks.landmark[landmark_index].y * image_height
        return (x, y)

    left_face_edge = get_landmark(234)
    right_face_edge = get_landmark(454)
    face_width = calculate_distance(left_face_edge, right_face_edge)

    left_eyebrow_distance = calculate_distance(get_landmark(66), get_landmark(159))
    right_eyebrow_distance = calculate_distance(get_landmark(296), get_landmark(386))
    mouth_openness = calculate_distance(get_landmark(13), get_landmark(14))
    left_eye_openness = calculate_distance(get_landmark(159), get_landmark(145))
    right_eye_openness = calculate_distance(get_landmark(386), get_landmark(374))

    chin = get_landmark(152)
    nose_tip = get_landmark(1)
    forehead = get_landmark(10)
    vertical_tilt = calculate_angle(forehead, nose_tip, chin)

    left_eye = get_landmark(33)
    right_eye = get_landmark(263)
    horizontal_tilt = calculate_angle(left_face_edge, right_eye, left_eye)

    return {
        "face_width": face_width,
        "left_eyebrow_distance": left_eyebrow_distance,
        "right_eyebrow_distance": right_eyebrow_distance,
        "mouth_openness": mouth_openness,
        "left_eye_openness": left_eye_openness,
        "right_eye_openness": right_eye_openness,
        "vertical_tilt": vertical_tilt,
        "horizontal_tilt": horizontal_tilt,
    }

# Save analyzed features to CSV
def save_features_to_csv(features, image_path="Live Frame"):
    file_exists = os.path.isfile(CSV_FILE)
    headers = [
        "Image Path", "Face Width", "Left Eyebrow", "Right Eyebrow",
        "Mouth Openness", "Left Eye Openness", "Right Eye Openness",
        "Vertical Tilt", "Horizontal Tilt"
    ]

    with open(CSV_FILE, mode='a', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=headers)
        if not file_exists:
            writer.writeheader()

        writer.writerow({
            "Image Path": image_path,
            "Face Width": features.get("face_width", "N/A"),
            "Left Eyebrow": features.get("left_eyebrow_distance", "N/A"),
            "Right Eyebrow": features.get("right_eyebrow_distance", "N/A"),
            "Mouth Openness": features.get("mouth_openness", "N/A"),
            "Left Eye Openness": features.get("left_eye_openness", "N/A"),
            "Right Eye Openness": features.get("right_eye_openness", "N/A"),
            "Vertical Tilt": features.get("vertical_tilt", "N/A"),
            "Horizontal Tilt": features.get("horizontal_tilt", "N/A"),
        })

# Process an individual frame
def process_frame(image):
    with mp_holistic.Holistic(static_image_mode=True, min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = holistic.process(rgb_image)

        # Black canvas to draw MediaPipe landmarks on
        black_canvas = np.zeros((CANVAS_HEIGHT, CANVAS_WIDTH, 3), dtype=np.uint8)

        def normalize_and_draw_landmarks(landmarks, connections):
            if landmarks:
                mp_drawing.draw_landmarks(
                    black_canvas, landmarks, connections,
                    landmark_drawing_spec=mp_drawing_styles.get_default_face_mesh_tesselation_style()
                )

        # Draw face, hand, and pose landmarks if present
        if results.face_landmarks:
            normalize_and_draw_landmarks(results.face_landmarks, mp_holistic.FACEMESH_TESSELATION)
        if results.pose_landmarks:
            normalize_and_draw_landmarks(results.pose_landmarks, mp_holistic.POSE_CONNECTIONS)
        if results.left_hand_landmarks:
            normalize_and_draw_landmarks(results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS)
        if results.right_hand_landmarks:
            normalize_and_draw_landmarks(results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS)

        return results, black_canvas

# Socket.IO event for frame processing
@socketio.on('process_frame')
def handle_frame(frame_data):
    if not frame_lock.acquire(blocking=False):
        emit('frame_processed', {'error': 'Backend is busy. Try again later.'})
        return

    try:
        if not frame_data or ',' not in frame_data:
            raise ValueError("Invalid frame data format.")

        image_data = frame_data.split(',')[1]
        img_bytes = io.BytesIO(base64.b64decode(image_data))
        img = Image.open(img_bytes).convert('RGB')

        image = np.array(img)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # Generate a unique filename for the processed black canvas frame
        frame_filename = os.path.join(OUTPUT_DIR, f"processed_frame_{int(time.time() * 1000)}.jpg")
        
        # Process the frame and obtain the black canvas with MediaPipe landmarks
        results, processed_canvas = process_frame(image)

        face_analysis_result = {}
        if results.face_landmarks:
            image_height, image_width, _ = image.shape
            face_analysis_result = analyze_face(results.face_landmarks, image_width, image_height)
            save_features_to_csv(face_analysis_result, image_path=frame_filename)

        canvas_pil = Image.fromarray(cv2.cvtColor(processed_canvas, cv2.COLOR_BGR2RGB)).resize((224, 224))

        # Use the Hugging Face model
        # predictions = model(canvas_pil)
        predictions2=model2(canvas_pil) 

        response_data = {
            # "predictions": predictions[0],
            "predictions2": predictions2[0],
            # "face_analysis": face_analysis_result if face_analysis_result else None
        }

        emit('frame_processed', response_data)

    except Exception as e:
        print(f"Error processing frame: {e}")
        emit('frame_processed', {'error': str(e)})
    finally:
        frame_lock.release()

# Define the main route
@app.route('/')
def index():
    return render_template('index.html')

# Run the application
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)