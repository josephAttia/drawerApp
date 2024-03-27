from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, auth
# use cros
from flask_cors import CORS
from werkzeug.security import check_password_hash



cred = credentials.Certificate("./smartlock-database-43f6a-firebase-adminsdk-5t5y1-20983c7b03.json")
firebase_admin.initialize_app(cred)

app = Flask(__name__)
CORS(app)


data = {}

@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/api/get_profile', methods=['GET'])
def get_user():
    uid = request.args.get('uid')
    try:
        user = auth.get_user(uid)
        return jsonify(user.__dict__), 200
    except:
        return jsonify({"error": "User not found"}), 404

@app.route('/api/register_user', methods=['POST'])
def register_user():
    # Get the user data from the request
    user_data = request.json
    email = user_data['email']
    password = user_data['password']
    name = user_data['name']
    
    user = auth.create_user(
        email=email,
        email_verified=False,
        password=user_data['password'],
        display_name=user_data['name'],
    )

    uid = user.uid 

    print("Successfully created new user: {0}".format(user.uid))

    # Add the user to the database
    # Return the user data
    return uid


@app.route('/api/login', methods=['POST'])
def login_user():
    user_data = request.json
    email = user_data['email']
    password = user_data['password']

    print(email, password)

    print("Attempting to login user with email: {0}".format(email))
    

    try:
        user = auth.get_user_by_email(email)
        # convert user to dict
        user = user.__dict__
        password_hash = user['_data']['passwordHash']

        if check_password_hash(password_hash, password):
            return jsonify(user.__dict__), 200
        else:
            return jsonify(user), 200
    except:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(user.__dict__), 200

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



if __name__ == '__main__':
    app.run(debug=True)