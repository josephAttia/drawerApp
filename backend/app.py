import uuid
from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, db
# use cros
from flask_cors import CORS
import base64
import hashlib



cred = credentials.Certificate("./smartlock-database-43f6a-firebase-adminsdk-5t5y1-20983c7b03.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://smartlock-database-43f6a-default-rtdb.firebaseio.com/'
})



app = Flask(__name__)
CORS(app)

def generate_unique_id():
    return str(uuid.uuid4())

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed_password):
    return hash_password(password) == hashed_password

def check_if_user_exists(email):
    ref = db.reference('users')
    users = ref.get()
    for uid in users:
        user = users[uid]
        if user['email'] == email:
            return True
    return False

def get_user_by_email(email):
    ref = db.reference('users')
    users = ref.get()
    for uid in users:
        user = users[uid]
        if user['email'] == email:
            return user
    return None

data = {}

@app.route('/')
def hello_world():
    print("Hello, World!")
    return 'Hello, World!'


@app.route('/api/get_profile', methods=['GET'])
def get_user():
    uid = request.args.get('uid')
    ref = db.reference('users')
    user = ref.child(uid).get()
    return jsonify(user), 200

@app.route('/api/register_user', methods=['POST'])
def register_user():
    # Get the user data from the request
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
        "drawers": [],

    })

    return uid


@app.route('/api/add_drawer', methods=['POST'])
def add_drawer():
    drawer_data = request.json
    uid = drawer_data['uid']
    drawer_name = drawer_data['drawer_name']

    ref = db.reference('users')
    user = ref.child(uid).get()
    drawers = user['drawers']
    drawers.append(drawer_name)
    ref.child(uid).update({
        "drawers": drawers
    })

    return jsonify(user), 200

@app.route('/api/login', methods=['POST'])
def login_user():
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

# write me a route that takes in a json and just saves that
# json to the database
@app.route('/api/set_data', methods=['POST'])
def save_data():
    data = request.json
    # Save the data to the database
    return data
    # Return the data

# write me a route that displays all the data in the database
@app.route('/api/get_data', methods=['GET'])
def get_data():
    return data

@app.route('/api/upload_image', methods=['POST'])
def upload_image():

    print(request.files)
    # if 'image' not in request.files:
    #     return jsonify({"error": "No image provided"}), 400

    # image_file = request.files['image']

    # if image_file.filename == '':
    #     return jsonify({"error": "No selected image"}), 400

    # # Process the image file here (e.g., save it, encode it, etc.)
    # encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
    # print(encoded_image)

    return jsonify({"image": request.files}), 200

@app.route('/api/set_sensor_data', methods=['POST'])
def sensor_data():
    data = request.json
    print(data)
    return jsonify(data), 200

if __name__ == '__main__':
    app.run(debug=True)