from flask import Blueprint, request, jsonify
import os
import base64
from PIL import Image
from io import BytesIO
from datetime import datetime
import requests  # For sending the image to Hugging Face

# Define the blueprint
frame_upload_bp = Blueprint('frame_upload', __name__)

# Directory to store the frames
INPUT_DIRECTORY = "input_frames"
os.makedirs(INPUT_DIRECTORY, exist_ok=True)

# Route to handle the incoming frame upload
@frame_upload_bp.route('/upload_frame', methods=['POST'])
def upload_frame():
    """
    This route handles the incoming frames from the React frontend.
    It decodes the Base64 string, sends it to Hugging Face for processing, and returns the processed frame.
    """
    data = request.json
    frame_data = data.get('frame')  # Base64 string of the frame

    if frame_data:
        try:
            # Decode the Base64 string (remove data URL header if present)
            image_data = base64.b64decode(frame_data.split(",")[1])  # Split to remove the header
            image = Image.open(BytesIO(image_data))  # Open the image using Pillow

            # Save the image to the 'input_frames' directory
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
            frame_filename = os.path.join(INPUT_DIRECTORY, f"frame_{timestamp}.png")
            image.save(frame_filename)

            # Send the image to Hugging Face for processing (example API call)
            processed_frame = send_to_hugging_face(frame_filename)

            return jsonify({
                "status": "success",
                "message": "Frame saved and processed",
                "processed_frame": processed_frame  # Assuming Hugging Face returns base64 or image URL
            }), 200
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    else:
        return jsonify({"status": "error", "message": "No frame data received"}), 400


def send_to_hugging_face(image_path):
    """
    Send the image to Hugging Face or an external API for processing and get the transformed frame.
    """
    # Example: Send to Hugging Face API (this is just a placeholder URL)
    api_url = "https://huggingface.co/your-model-endpoint"
    files = {'file': open(image_path, 'rb')}
    response = requests.post(api_url, files=files)
    
    if response.status_code == 200:
        processed_image = response.json().get('processed_image')  # Example response
        return processed_image  # This could be a URL or base64 string
    else:
        raise Exception("Error processing frame with Hugging Face.")