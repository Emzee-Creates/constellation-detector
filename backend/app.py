from flask import Flask, request, jsonify
from flask_cors import CORS
from tasks import submit_astrometry_job

app = Flask(__name__)
CORS(app)

@app.route('/detect-stars', methods=['POST'])
def detect_stars_route():
    file = request.files.get('image')
    if not file:
        return jsonify({"status": "error", "message": "No image provided"}), 400

    image_bytes = file.read()
    result = submit_astrometry_job(image_bytes)

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
