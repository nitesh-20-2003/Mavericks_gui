import os
import cv2
from flask import Blueprint, request, jsonify

video_blueprint = Blueprint('video', __name__)

# Define directories
INPUT_DIR = "./videos"
OUTPUT_DIR = "./output_frames"

@video_blueprint.route('/convert', methods=['POST'])
def convert_video_to_frames():
    """
    Flask route to handle video uploads and convert them to frames.
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

    # Clean up video after extracting frames
    os.remove(video_path)

    return jsonify({
        "message": f"Video {video_file.filename} processed successfully!",
        "frame_paths": frame_paths
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
