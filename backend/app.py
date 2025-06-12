from flask import Flask, request, jsonify
from flask_cors import CORS
from star_detector import detect_stars

app = Flask(__name__)
CORS(app)

@app.route('/detect-stars', methods=['POST'])
def detect_stars_route():
    file = request.files.get('image')
    if not file:
        return jsonify({"status": "error", "message": "No image provided"}), 400

    image_bytes = file.read()
    stars = detect_stars(image_bytes)

    return jsonify({
        "status": "success",
        "constellation_lines": convert_to_lines(stars)
    })

def convert_to_lines(stars):
    # Connect consecutive stars into lines
    lines = []
    for i in range(len(stars) - 1):
        lines.append({
            "x1": stars[i]["x"],
            "y1": stars[i]["y"],
            "x2": stars[i + 1]["x"],
            "y2": stars[i + 1]["y"]
        })
    return lines

if __name__ == '__main__':
    app.run(debug=True)
