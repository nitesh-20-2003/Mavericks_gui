from flask import Flask, jsonify
from routes.ai_routes import ai_blueprint
import os
from dotenv import load_dotenv
from flask_cors import CORS
# Load environment variables from .env
load_dotenv()

# Get the host and port from the .env file
host = os.getenv("FLASK_HOST", "127.0.0.1")
port = int(os.getenv("FLASK_PORT_AI", 5201))  # Default port for the AI app is 5201
app = Flask(__name__)
CORS(app)

# Register the AI blueprint
app.register_blueprint(ai_blueprint, url_prefix='/api/py')

# Define the home route
@app.route('/')
def home():
    """
    Home route for the AI Flask app.
    """
    return jsonify({
        "message": "Welcome to the AI Flask Application!",
        "endpoints": {
            "ai_generate": "/ai/generate",
            "ai_translate": "/ai/translate"
        }
    })

if __name__ == '__main__':
    app.run(host=5102, port=port, debug=True)
