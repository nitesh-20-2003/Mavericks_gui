from flask import Blueprint, request, jsonify
import google.generativeai as genai
import os  # Import os to access environment variables
from dotenv import load_dotenv  # Import dotenv to load .env file

# Load environment variables from the .env file
load_dotenv()

# Get the API key from environment variables
google_api_key = os.getenv("GOOGLE_API_KEY")

# Check if the key exists and configure the API
if not google_api_key:
    raise ValueError("Google API Key not found. Please set it in the .env file.")
genai.configure(api_key=google_api_key)

# Initialize the generative AI model
model = genai.GenerativeModel('gemini-pro')

ai_blueprint = Blueprint('ai', __name__)

# Global variable to store the rewritten sentence
rewritten_sentence = None

@ai_blueprint.route('/generate', methods=['POST'])
def generate_emotion_text():
    """
    API endpoint to generate text based on the input sentence and emotion.
    """
    global rewritten_sentence
    data = request.get_json()
    sentence = data.get('sentence')
    emotion = data.get('emotion')

    if not sentence or not emotion:
        return jsonify({"error": "Both 'sentence' and 'emotion' fields are required."}), 400

    # Generate content for the rewritten sentence
    response_1 = model.generate_content(f"Rewrite the sentence: '{sentence}' in the detected emotion: {emotion}")
    response_2 = model.generate_content(
        "State and enlist the non-manual features detected like eye distances, eyebrow distance, mouth-to-nose distance, and so on."
    )

    rewritten_sentence = response_1.text.strip()

    return jsonify({
        'rewritten_sentence': rewritten_sentence,
        'non_manual_features': response_2.text.strip()
    })


@ai_blueprint.route('/translate', methods=['POST'])
def translate_sentence():
    """
    API endpoint to translate the last rewritten sentence into another language.
    """
    global rewritten_sentence

    if not rewritten_sentence:
        return jsonify({'error': 'No sentence available to translate. Please generate a sentence first.'}), 400

    data = request.get_json()
    language = data.get('language')

    if not language:
        return jsonify({"error": "The 'language' field is required."}), 400

    # Generate content for the translation of the last rewritten sentence
    response_3 = model.generate_content(f"Translate this sentence: '{rewritten_sentence}' into {language}")

    return jsonify({
        'translated_sentence': response_3.text.strip()
    })