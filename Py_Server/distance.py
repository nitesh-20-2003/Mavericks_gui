import cv2
import mediapipe as mp
import os
import math

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh()

# Helper functions for distance and angle calculation
def calculate_distance(point1, point2):
    """Calculate the Euclidean distance between two points."""
    return math.sqrt((point2[0] - point1[0])**2 + (point2[1] - point1[1])**2)

def calculate_angle(point1, point2, point3):
    """Calculate the angle between three points."""
    vector1 = (point1[0] - point2[0], point1[1] - point2[1])
    vector2 = (point3[0] - point2[0], point3[1] - point2[1])

    dot_product = vector1[0] * vector2[0] + vector1[1] * vector2[1]
    magnitude1 = math.sqrt(vector1[0]**2 + vector1[1]**2)
    magnitude2 = math.sqrt(vector2[0]**2 + vector2[1]**2)

    cos_theta = dot_product / (magnitude1 * magnitude2)
    angle = math.acos(cos_theta)

    return math.degrees(angle)

# Function to analyze face and extract features
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
    mouth_smile_width = calculate_distance(get_landmark(61), get_landmark(291))  # Mouth corners

    # Eye squinting (left and right)
    left_eye_openness = calculate_distance(get_landmark(159), get_landmark(145))  # Left eye openness
    right_eye_openness = calculate_distance(get_landmark(386), get_landmark(374))  # Right eye openness

    # Head tilt detection
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
    mouth_smile_normalized = mouth_smile_width / face_width
    left_eye_openness_normalized = left_eye_openness / face_width
    right_eye_openness_normalized = right_eye_openness / face_width

    return {
        "face_width": face_width,
        "left_eyebrow": left_eyebrow_normalized,
        "right_eyebrow": right_eyebrow_normalized,
        "mouth_openness": mouth_openness_normalized,
        "mouth_smile_width": mouth_smile_normalized,
        "left_eye_openness": left_eye_openness_normalized,
        "right_eye_openness": right_eye_openness_normalized,
        "vertical_tilt": vertical_tilt,
        "horizontal_tilt": horizontal_tilt,
    }

# Function to process all images in a directory
def process_images_in_directory(image_dir):
    image_paths = []
    for emotion_folder in os.listdir(image_dir):
        emotion_folder_path = os.path.join(image_dir, emotion_folder)
        if os.path.isdir(emotion_folder_path):
            # Get all image files from the emotion folder
            image_paths.extend([os.path.join(emotion_folder_path, file) for file in os.listdir(emotion_folder_path) if file.endswith(('.jpg', '.png'))])

    # Process each image and extract facial features
    all_facial_features = []
    for image_path in image_paths:
        image = cv2.imread(image_path)
        image_height, image_width, _ = image.shape

        # Process the image with MediaPipe FaceMesh
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(image_rgb)

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                # Analyze the face and extract features
                facial_features = analyze_face(face_landmarks, image_width, image_height)
                all_facial_features.append({
                    "image_path": image_path,
                    "facial_features": facial_features
                })

    return all_facial_features

# Example usage: Process all images in the specified directory
image_dir = "/content/train"  # Directory containing subfolders for each emotion
facial_features_data = process_images_in_directory(image_dir)

# At this point, `facial_features_data` contains the extracted features,
# and you can save or use them as needed in another part of your application.
print("Facial features have been extracted.")
