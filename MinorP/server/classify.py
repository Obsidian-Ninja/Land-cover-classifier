import sys
import tensorflow as tf
import numpy as np
import requests
from PIL import Image
from io import BytesIO

# Load the model
model = tf.keras.models.load_model('model/model.h5')

# Simulate satellite image retrieval using Google Static Maps API (you can use another source if needed)
def get_satellite_image(lat, lng, zoom=15, size="400x400"):
    url = f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lng}&zoom={zoom}&size={size}&maptype=satellite&key=YOUR_GOOGLE_MAPS_API_KEY"
    response = requests.get(url)
    img = Image.open(BytesIO(response.content))
    return img

# Preprocess image (this should match your training data preprocessing)
def preprocess_image(img):
    img = img.resize((224, 224))  # Adjust size as needed
    img_array = np.array(img) / 255.0  # Normalize if required
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

# Perform classification
def classify_image(img_array):
    prediction = model.predict(img_array)
    predicted_class = np.argmax(prediction, axis=1)
    return str(predicted_class[0])

# Get coordinates from the command-line arguments
sw_lat, sw_lng, ne_lat, ne_lng = map(float, sys.argv[1:])

# Here, we use the center of the bounding box for simplicity
center_lat = (sw_lat + ne_lat) / 2
center_lng = (sw_lng + ne_lng) / 2

# Get satellite image for the center point
img = get_satellite_image(center_lat, center_lng)

# Preprocess and classify the image
img_array = preprocess_image(img)
classification_result = classify_image(img_array)

# Output the result
print(classification_result)
