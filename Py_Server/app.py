import os
import io
import base64
import cv2
import mediapipe as mp
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

def process_frame(image):
    """
    Process an image frame to extract landmarks and generate a black canvas.
    """
    with mp_holistic.Holistic(static_image_mode=True, min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = holistic.process(rgb_image)

        black_canvas = np.zeros((CANVAS_HEIGHT, CANVAS_WIDTH, 3), dtype=np.uint8)

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

        return black_canvas

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
        processed_canvas = process_frame(image)

        # Convert the processed canvas to PIL Image for Hugging Face
        canvas_pil = Image.fromarray(cv2.cvtColor(processed_canvas, cv2.COLOR_BGR2RGB)).resize((224, 224))

        # Perform classification
        results = model(canvas_pil)

        # Print predictions in the terminal
        print("Predicted classifications:", results)

        # Send the prediction result back to the client
        if results:
            emit('frame_processed', {'predictions': results[0]})
        else:
            emit('frame_processed', {'error': 'No predictions returned by the model.'})
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
