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

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Initialize Flask-SocketIO
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")

# Hugging Face Model
print("Loading Hugging Face model...")
model = pipeline("image-classification", model="parasahuja23/vit-base-patch16-224-in21k-finetuned-final-2.0")
print("Model loaded successfully!")

# Mediapipe Setup
mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Frame Lock for Thread Safety
frame_lock = Lock()

# Black Canvas Dimensions
CANVAS_WIDTH = 1920
CANVAS_HEIGHT = 1080

# Function to calculate Euclidean distance between two points
def calculate_distance(point1, point2):
    return math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2)

# Function to calculate the angle between three points (e.g., head tilt)
def calculate_angle(point1, point2, point3):
    a = calculate_distance(point2, point3)
    b = calculate_distance(point1, point3)
    c = calculate_distance(point1, point2)
    if a * b == 0:  # Prevent division by zero
        return 0
    angle = math.acos((a**2 + b**2 - c**2) / (2 * a * b))
    return math.degrees(angle)

# Analyze the face and calculate features
def analyze_face(face_landmarks, image_width, image_height):
    # Extract landmark coordinates
    def get_landmark(landmark_index):
        x = face_landmarks.landmark[landmark_index].x * image_width
        y = face_landmarks.landmark[landmark_index].y * image_height
        return (x, y)

    # Calculate reference scale: face width (distance between landmarks 454 and 234)
    left_face_edge = get_landmark(234)
    right_face_edge = get_landmark(454)
    face_width = calculate_distance(left_face_edge, right_face_edge)

    # Eyebrow raise (left and right)
    left_eyebrow_distance = calculate_distance(get_landmark(66), get_landmark(159))  # Left eyebrow to left eye
    right_eyebrow_distance = calculate_distance(get_landmark(296), get_landmark(386))  # Right eyebrow to right eye

    # Mouth openness
    mouth_openness = calculate_distance(get_landmark(13), get_landmark(14))  # Upper lip to lower lip

    # Smile detection (horizontal distance between mouth corners)
    # Eye squinting (left and right)
    left_eye_openness = calculate_distance(get_landmark(159), get_landmark(145))  # Left eye openness
    right_eye_openness = calculate_distance(get_landmark(386), get_landmark(374))  # Right eye openness

    # Head tilt detection
    # Vertical tilt (angle between chin, nose, and forehead landmarks)
    chin = get_landmark(152)
    nose_tip = get_landmark(1)
    forehead = get_landmark(10)
    vertical_tilt = calculate_angle(forehead, nose_tip, chin)

    # Horizontal tilt (angle between left and right eye landmarks relative to horizontal plane)
    left_eye = get_landmark(33)
    right_eye = get_landmark(263)
    horizontal_tilt = calculate_angle(left_face_edge, right_eye, left_eye)

    # Normalize distances by face width
    left_eyebrow_normalized = left_eyebrow_distance / face_width
    right_eyebrow_normalized = right_eyebrow_distance / face_width
    mouth_openness_normalized = mouth_openness / face_width
    left_eye_openness_normalized = left_eye_openness / face_width
    right_eye_openness_normalized = right_eye_openness / face_width

    # Return the calculated values as a dictionary
    return {
        "face_width": face_width,
        "left_eyebrow_distance": left_eyebrow_distance,
        "right_eyebrow_distance": right_eyebrow_distance,
        "mouth_openness": mouth_openness,
        "left_eye_openness": left_eye_openness,
        "right_eye_openness": right_eye_openness,
        "vertical_tilt": vertical_tilt,
        "horizontal_tilt": horizontal_tilt,
        "left_eyebrow_normalized": left_eyebrow_normalized,
        "right_eyebrow_normalized": right_eyebrow_normalized,
        "mouth_openness_normalized": mouth_openness_normalized,
        "left_eye_openness_normalized": left_eye_openness_normalized,
        "right_eye_openness_normalized": right_eye_openness_normalized,
    }

def process_frame(image):
    """
    Process an image frame to extract landmarks and generate a black canvas.
    """
    with mp_holistic.Holistic(static_image_mode=True, min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = holistic.process(rgb_image)

        black_canvas = np.zeros((CANVAS_WIDTH, CANVAS_HEIGHT, 3), dtype=np.uint8)

        # Normalize and draw landmarks
        def normalize_and_draw_landmarks(landmarks, connections):
            if landmarks:
                mp_drawing.draw_landmarks(
                    black_canvas, landmarks, connections, 
                    landmark_drawing_spec=mp_drawing_styles.get_default_face_mesh_tesselation_style()
                )

        # Process different body parts
        if results.face_landmarks:
            normalize_and_draw_landmarks(results.face_landmarks, mp_holistic.FACEMESH_TESSELATION)
        if results.pose_landmarks:
            normalize_and_draw_landmarks(results.pose_landmarks, mp_holistic.POSE_CONNECTIONS)
        if results.left_hand_landmarks:
            normalize_and_draw_landmarks(results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS)
        if results.right_hand_landmarks:
            normalize_and_draw_landmarks(results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS)

        return results, black_canvas

@socketio.on('process_frame')
def handle_frame(frame_data):
    """
    Handle a frame received from the client via WebSocket.
    """
    if not frame_lock.acquire(blocking=False):
        emit('frame_processed', {'error': 'Backend is busy. Try again later.'})
        return

    try:
        # Validate and decode Base64 image
        if not frame_data or ',' not in frame_data:
            raise ValueError("Invalid frame data format.")
        
        image_data = frame_data.split(',')[1]
        img_bytes = io.BytesIO(base64.b64decode(image_data))
        img = Image.open(img_bytes).convert('RGB')

        # Convert PIL Image to OpenCV format
        image = np.array(img)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # Process the frame with Mediapipe
        results, processed_canvas = process_frame(image)

        # If face landmarks are detected, analyze them
        face_analysis_result = {}
        if results.face_landmarks:
            image_height, image_width, _ = image.shape
            face_analysis_result = analyze_face(results.face_landmarks, image_width, image_height)

        # Convert the processed canvas to PIL Image for Hugging Face
        canvas_pil = Image.fromarray(cv2.cvtColor(processed_canvas, cv2.COLOR_BGR2RGB)).resize((224, 224))

        # Perform classification
        predictions = model(canvas_pil)

        # Prepare the response data
        response_data = {
            "predictions": predictions[0],
            "face_analysis": face_analysis_result if face_analysis_result else None
        }

        # Send the response back to the client
        emit('frame_processed', response_data)

    except Exception as e:
        print(f"Error processing frame: {e}")
        emit('frame_processed', {'error': str(e)})
    finally:
        frame_lock.release()

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
