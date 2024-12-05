from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS
from routes.video_routes import video_blueprint
from routes.ai_routes import ai_blueprint

app = Flask(__name__)

# Enable CORS for the entire application
CORS(app)

# Register the blueprints
app.register_blueprint(video_blueprint, url_prefix='/video')
app.register_blueprint(ai_blueprint, url_prefix='/ai')

@app.route('/', methods=['GET'])
def welcomepage():
    return jsonify({"message": "Welcome to the Flask server for video processing and AI text generation!"})

# 404 Error Handler
@app.errorhandler(404)
def not_found(error):
    """
    Custom handler for 404 - Not Found errors.
    """
    return jsonify({
        'error': 'Not Found',
        'message': 'The requested resource could not be found on this server.'
    }), 404

# 500 Error Handler (Optional)
@app.errorhandler(500)
def internal_server_error(error):
    """
    Custom handler for 500 - Internal Server Error.
    """
    return jsonify({
        'error': 'Internal Server Error',
        'message': 'An unexpected error occurred on the server.'
    }), 500

if __name__ == '__main__':
    port = 5000
    print(f"Flask server is running on http://localhost:{port}")
    app.run(debug=True, host='0.0.0.0', port=port)
