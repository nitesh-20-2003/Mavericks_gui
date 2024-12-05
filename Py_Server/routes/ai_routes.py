from flask import Blueprint, request, jsonify
import google.generativeai as genai

# Configure the Generative AI API with your Google API key
google_api_key = "AIzaSyAXiYmqpp4agwr1O3fMV9LjFpIv2m0li2Y"
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

    # Generate content for the rewritten sentence
    response_1 = model.generate_content(f"Rewrite the sentence: '{sentence}' in the detected emotion: {emotion}")
    response_2 = model.generate_content(
        f"State and enlist the non-manual features detected to conclude the emotion according to Indian Sign Language in the above case."
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

    # Generate content for the translation of the last rewritten sentence
    response_3 = model.generate_content(f"Translate this sentence: '{rewritten_sentence}' into {language}")

    return jsonify({
        'translated_sentence': response_3.text.strip()
    })
