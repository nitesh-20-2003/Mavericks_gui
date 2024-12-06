import os
import cv2
from flask import Blueprint, request, jsonify
from transformers import pipeline
from PIL import Image

# Flask Blueprint
video_blueprint = Blueprint('video', __name__)

# Directories
INPUT_DIR = "./videos"
OUTPUT_DIR = "./output_frames"
CLASSIFICATION_OUTPUT = "./classification_results"

# Hugging Face Model
pipe = pipeline("image-classification", "parasahuja23/vit-base-patch16-224-in21k-finetuned-eurosat")

# Route to Convert Video to Frames and Classify Images
@video_blueprint.route('/process', methods=['POST'])
def process_video():
    """
    Flask route to handle video uploads, convert them to frames, and classify each frame.
    """
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video_file = request.files['video']

    # Save the uploaded video file
    os.makedirs(INPUT_DIR, exist_ok=True)
    video_path = os.path.join(INPUT_DIR, video_file.filename)
    video_file.save(video_path)

    # Convert the video to frames
    frame_paths = extract_frames(video_path, OUTPUT_DIR)
    if not frame_paths:
        return jsonify({"error": "No frames were extracted"}), 500

    # Classify each frame
    classification_results = classify_frames(frame_paths)

    # Clean up video after processing
    os.remove(video_path)

    return jsonify({
        "message": f"Video {video_file.filename} processed successfully!",
        "classification_results": classification_results
    })

def extract_frames(video_path, output_dir):
    """
    Extract frames from a video and save them in the output directory.
    Returns a list of saved frame paths.
    """
    video_name = os.path.splitext(os.path.basename(video_path))[0]
    cap = cv2.VideoCapture(video_path)
    frame_paths = []
    frame_count = 0

    # Create output directory for the video
    video_output_dir = os.path.join(output_dir, video_name)
    os.makedirs(video_output_dir, exist_ok=True)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_filename = f"{video_output_dir}/frame_{frame_count:04d}.jpg"
        cv2.imwrite(frame_filename, frame)
        frame_paths.append(frame_filename)
        frame_count += 1

    cap.release()
    print(f"Processed {video_name}, extracted {frame_count} frames.")
    return frame_paths

def classify_frames(frame_paths):
    """
    Classify each frame using the Hugging Face image classification pipeline.
    Returns a list of classification results.
    """
    os.makedirs(CLASSIFICATION_OUTPUT, exist_ok=True)
    results = []

    for frame_path in frame_paths:
        try:
            # Open the frame as an image
            image = Image.open(frame_path)
            print(f"Classifying {frame_path}")
            # Perform classification
            classifications = pipe(image)
            print(f"Classifications for {frame_path}: {classifications}")

            # Save classification results
            result = {
                "frame_path": frame_path,
                "classifications": classifications
            }
            results.append(result)

        except Exception as e:
            print(f"Error classifying {frame_path}: {e}")
            results.append({
                "frame_path": frame_path,
                "error": str(e)
            })

    return results
