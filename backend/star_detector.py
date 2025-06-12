import cv2
import numpy as np
import io
from PIL import Image

def detect_stars(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("L")  # convert to grayscale
    img_np = np.array(image)

    # Apply threshold to find bright regions
    _, thresh = cv2.threshold(img_np, 200, 255, cv2.THRESH_BINARY)

    # Find contours (possible stars)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    stars = []
    for cnt in contours:
        M = cv2.moments(cnt)
        if M["m00"] != 0:
            cx = int(M["m10"] / M["m00"])
            cy = int(M["m01"] / M["m00"])
            stars.append({"x": cx, "y": cy})

    return stars
