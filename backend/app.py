from flask import Flask, request
import firebase_admin
from firebase_admin import credentials


cred = credentials.Certificate("./smartlock-database-43f6a-firebase-adminsdk-5t5y1-20983c7b03.json")
firebase_admin.initialize_app(cred)

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/api/register_user', methods=['POST'])
def register_user():
    # Get the user data from the request
    user_data = request.json
    # Add the user to the database
    # Return the user data
    return 'User registered!'



if __name__ == '__main__':
    app.run(debug=True)