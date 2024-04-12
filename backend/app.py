# Import necessary libraries
from io import BytesIO
import json
import os
import re
import uuid
from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, db
from flask_cors import CORS  # Enable Cross-Origin Resource Sharing (CORS)
import base64
import hashlib
from PIL import Image
import uuid
import random
from datetime import datetime
import requests

# Firebase Admin Initialization
cred = credentials.Certificate("./smartlock-database-43f6a-firebase-adminsdk-5t5y1-20983c7b03.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://smartlock-database-43f6a-default-rtdb.firebaseio.com/'
})



# Create Flask app
app = Flask(__name__)
CORS(app) 


# Utility functions
def generate_unique_id():
    """Generates a unique UUID."""
    return str(uuid.uuid4())

def convert_image_to_base64(image_path):
    """Converts an image to base64 format."""
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read())
        return encoded_string.decode('utf-8')
    
def download_image_from_url(image_url):
    response = requests.get(image_url)
    if response.status_code == 200:
        # Create a temporary file to save the image
        with open("temp_image.jpg", "wb") as temp_file:
            temp_file.write(response.content)
        
        base_64 = convert_image_to_base64("temp_image.jpg")
        os.remove("temp_image.jpg")
        return base_64
    else:
        raise Exception("Failed to download image")
  

def hash_password(password):
    """Hashes a given password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password, hashed_password):
    """Verifies if a given password matches a hashed password."""
    return hash_password(password) == hashed_password


def convert_string_to_json(string):
    """Converts a string to JSON format."""
    return json.loads(string)


def check_if_user_exists(email):
    """Checks if a user exists in the Firebase database."""
    ref = db.reference('users')
    users = ref.get()
    for uid in users:
        user = users[uid]
        if user['email'] == email:
            return True
    return False


def get_user_by_email(email):
    """Retrieves a user's data based on their email."""
    ref = db.reference('users')
    users = ref.get()
    for uid in users:
        user = users[uid]
        if user['email'] == email:
            return user
    return None


def check_db_connection():
    """Checks the connection to the Firebase database."""
    try:
        db.reference().get()
        return True
    except:
        return False


# Global variables
data = {}
current_user_logged_in = None


# print(download_image_from_url('https://firebasestorage.googleapis.com/v0/b/esppractice-17e5a.appspot.com/o/data%2Fphoto_6.jpg?alt=media&token=0ed0928a-7665-41cf-a38c-2e261a9c19e9'))

def generate_random_drawer():
    # Generate a random drawer name
    drawer_name = 'drawer' + str(uuid.uuid4())

    # Generate random status, time opened, armed status, battery level, and unauthorized access
    status = 1 if random.random() < 0.5 else 0
    time_opened = datetime.now().isoformat()
    armed_status = 1 if random.random() < 0.5 else 0
    battery_level = random.randint(0, 100)  # Random number between 0 and 100
    unauthorized_access = 1 if random.random() < 0.5 else 0
    image = convert_image_to_base64('lollz.jpg')

    # Create the drawer data object
    drawer_data = {
        drawer_name: {
            'status': status,
            'time_opened': time_opened,
            'armed_status': armed_status,
            'battery_level': battery_level,
            'unauthorized_access': unauthorized_access,
            'image': image
        }
    }

    return drawer_data


# Routes
@app.route('/')
def hello_world():
    """Default route to test server."""
    print("Hello, World!")
    return 'Hello, World!'


@app.route('/api/get_profile', methods=['GET'])
def get_user():
    """Retrieve a user's profile based on UID."""
    uid = request.args.get('uid')
    ref = db.reference('users')
    user = ref.child(uid).get()
    if user is None:
        return jsonify({"error": "User not found"}), 400
    
    current_user_logged_in = user
    return jsonify(user), 200


@app.route('/api/get_current_logged_in_user', methods=['GET'])
def get_current_user():
    """Get the data of the currently logged-in user."""
    return jsonify(current_user_logged_in), 200




@app.route('/api/register_user', methods=['POST'])
def register_user():
    """Register a new user."""
    user_data = request.json
    email = user_data['email']
    password = user_data['password']
    name = user_data['name']

    if not email or not password or not name:
        return jsonify({"error": "Missing one or more required fields"}), 400
    
    print("Attempting to register user with email: {0}".format(email))

    ref = db.reference('users') 
    uid = generate_unique_id()

    hashed_password = hash_password(password)
    print(hashed_password)

    ref.child(uid).set({
        "email": email,
        "name": name,
        "password": hashed_password,
        "uid": uid,
    })

    return uid


@app.route('/api/get_drawers', methods=['GET'])
def get_drawers():
    """Retrieve a user's drawers."""
    db_status = check_db_connection()

    if not db_status:
        print("Database connection error")
        return jsonify({"error": "Database connection error"}), 500
    
    uid = request.args.get('uid')
    user_ref = db.reference('users').child(uid)
    user_drawers = user_ref.child('drawers').get()

    if user_drawers is None:
        default_drawers = {"drawer1": "default value"}
        user_ref.child('drawers').set(default_drawers)
        user_drawers = default_drawers

    return jsonify(user_drawers), 200

@app.route('/api/add_drawer', methods=['POST'])
def add_drawer():
    print("Adding drawer")
    
    title = request.json['title']
    description = request.json['description']
    location = request.json['location']
    mac_address = request.json['mac_address']
    uid = request.json['uid']

    user_ref = db.reference('users').child(uid)
    user_drawers = user_ref.child('drawers').get()

    if user_drawers is None:
        default_drawers = {"drawer1": "default value"}
        user_ref.child('drawers').set(default_drawers)
        user_drawers = default_drawers


    drawer_data = {
        'title': title,
        'description': description,
        'location': location,
        'mac_address': mac_address,
        'status': "",
        'time_opened': "",
        'armed_status': "",
        'battery_level': "100",
        'image': convert_image_to_base64('lollz.jpg'),
    }

    drawer_name = 'drawer' + str(uuid.uuid4())
    user_drawers.update({drawer_name: drawer_data})
    user_ref.child('drawers').set(user_drawers)


    return jsonify({"drawer_name": drawer_name}), 200

@app.route('/api/get_latest_drawer_activity', methods=['GET'])
def get_latest_drawer_activity():

    uid = request.args.get('uid')
    user_ref = db.reference('users').child(uid)

    # pick a random drawer
    drawer_name = list(user_ref.child('drawers').get().keys())
    drawer_name = drawer_name[1]
    drawer_logs = user_ref.child('drawers').child(drawer_name).child('logs').get()

    if drawer_logs is None:
        return jsonify({"error": "No logs found for drawer"}), 200
    
    latest_log = list(drawer_logs.keys())[-1]
    latest_log_image = drawer_logs[latest_log]

    return jsonify({"latest_log": latest_log, "latest_log_image": latest_log_image}), 200


@app.route('/api/add_new_drawer_entry', methods=['POST'])
def add_new_drawer_entry():
    print("Adding new drawer entry")
    print(request.data)

    # drawer_name = 'drawer3b4f75b6-1666-4831-99b3-e4e2ee86e256'

    # get the current time 
    # time_opened = datetime.now().isoformat()

    # # make a sub entry in the drawer titled 'logs' and add the time_opened   
    # uid = '2ece2b14-ea45-4b3a-b163-2a7035babc0e'
    # user_ref = db.reference('users').child(uid)
    # user_ref.child('drawers').child(drawer_name).child('logs').push(time_opened)

    # # under the logs entry, and under the time_opened entry, add the image 
    # image = convert_image_to_base64('lollz.jpg')
    # user_ref.child('drawers').child(drawer_name).child('logs').child(time_opened).set(image)
    # # user_ref.child('drawers').child(drawer_name).child('logs').child(time_opened).set(
    
    return jsonify("bombocla"), 200
    

@app.route('/api/get_drawer_image', methods=['GET'])
def get_drawer_image():
    """Retrieve an image of a drawer."""
    drawer_name = request.args.get('drawer_id')
    uid = request.args.get('uid')

    user_ref = db.reference('users').child(uid)
    drawer_image = user_ref.child('drawers').child(drawer_name).child('image').get()

    return jsonify({"image": drawer_image}), 200


@app.route('/api/login', methods=['POST'])
def login_user():
    """Login a user."""
    user_data = request.json
    email = user_data['email']
    password = user_data['password']

    if not email or not password:
        return jsonify({"error": "Missing one or more required fields"}), 400
    
    if not check_if_user_exists(email):
        return jsonify({"error": "User does not exist"}), 400
    
    user = get_user_by_email(email)
    if not verify_password(password, user['password']):
        return jsonify({"error": "Invalid password"}), 400
    
    return jsonify(user), 200


@app.route('/api/set_data', methods=['POST'])
def save_data():
    """Save JSON data to the database."""
    data = request.data
    print(data)
    return data


# get the drawer armed status and return it
@app.route('/api/get_drawer_armed_status', methods=['GET'])
def get_drawer_armed_status():
    """Get the armed status of a drawer."""
    # drawer_name = request.args.get('drawer_id')
    # uid = request.args.get('uid')

    # user_ref = db.reference('users').child(uid)
    # armed_status = user_ref.child('drawers').child(drawer_name).child('armed_status').get()


    return jsonify({"armed_status": 1}), 200
    # if armed then return 1 else 0
    # if armed_status == 1:
    #     return jsonify({"armed_status": 1}), 200
    # else:
    #     return jsonify({"armed_status": 0}), 200
    


# get the drawer status and set it 
@app.route('/api/set_drawer_armed_status', methods=['POST'])
def set_drawer_armed_status():
    """Set the armed status of a drawer."""
    drawer_name = request.json['drawer_id']
    uid = request.json['uid']
    armed_status = request.json['armed_status']

    user_ref = db.reference('users').child(uid)
    user_ref.child('drawers').child(drawer_name).child('armed_status').set(armed_status)

    return jsonify({"armed_status": armed_status}), 200


@app.route('/api/get_data', methods=['GET'])
def get_data():
    """Get all data from the database."""
    return data


@app.route('/api/upload_image', methods=['POST'])
def upload_image():
    """Upload an image to the server."""
    print(request.files)
    return jsonify({"image": request.files}), 200


@app.route('/api/set_sensor_data', methods=['POST'])
def sensor_data():
    """Save sensor data to the database."""
    data = request.json
    print(data)
    return jsonify(data), 200


# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)
