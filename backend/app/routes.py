from flask import Blueprint, request, jsonify
from .features import generate_course_content, generate_learning_path, generate_response, listen_to_audio, speak_text
from .models import User
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import timedelta
from . import mongo, bcrypt
from textblob import TextBlob
from transformers import pipeline
import cohere
import pdfkit
import requests


cohere_client = cohere.Client('sUXLO3qVlYhG7a5KuY92bxGfycL30QrBNGD0QnQh')
D_ID_API_KEY = 'YW5hbmRoYXByYWtha3NoQGdtYWlsLmNvbQ:-bljFC9EOmCJRiEQSwc6G'



model_name = "gpt2"  # You can use other models like "bert-base-uncased"
nlp = pipeline("text-generation", model=model_name)

auth = Blueprint("auth",__name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password') 

    user_model = User(mongo, bcrypt)
    existing_user = user_model.find_user(username) or user_model.find_user(email)

    if existing_user:
        return jsonify({'message': 'User already exists'}), 400

    user_id = user_model.create_user(username, email, password)
    return jsonify({'message': 'User created', 'user_id': user_id}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier')
    password = data.get('password')

    user_model = User(mongo, bcrypt)
    user = user_model.find_user(identifier)

    if user and user_model.verify_password(user, password):
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify({'access_token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@auth.route('/analyze_sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.get_json()
    feedback = data.get('feedback')
    if not feedback:
        return jsonify({'error': 'No feedback provided'}), 400

    analysis = TextBlob(feedback)
    sentiment = analysis.sentiment.polarity

    return jsonify({'sentiment': sentiment})

@auth.route('/generate_learning_path', methods=['POST'])
def generate_path():
    data = request.get_json()
    student_id = data.get('student_id')
    performance_data = data.get('performance_data')
    feedback = data.get('feedback')

    if not student_id or not performance_data or not feedback:
        return jsonify({'error': 'Missing data'}), 400

    analysis = TextBlob(feedback)
    sentiment = analysis.sentiment.polarity

    learning_path = generate_learning_path(student_id, performance_data, sentiment)

    return jsonify({'learning_path': learning_path})

@auth.route('/query', methods=['POST'])
def handle_query():
    data = request.get_json()
    query = data.get('query')
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    try:
        # Generate response using Hugging Face Transformers
        response = nlp(query, max_length=150, num_return_sequences=1)
        answer = response[0]['generated_text'].strip()
        return jsonify({'response': answer})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@auth.route('/voice-interaction', methods=['POST'])
def voice_interaction():
    # Capture audio and convert to text
    query = listen_to_audio()
    if not query:
        return jsonify({'error': 'Could not understand the audio input'}), 400
    
    # Generate response
    response = generate_response(query)
    
    # Convert response to speech
    speak_text(response)
    
    return jsonify({'response': response})

@auth.route('/courses', methods=['GET'])
def get_courses():
    courses = mongo.db.courses.find()
    return jsonify([course for course in courses])

@auth.route('/courses', methods=['POST'])
def add_course():
    course_data = request.json
    mongo.db.courses.insert_one(course_data)
    return jsonify(course_data), 201

pdfkit_config = pdfkit.configuration(wkhtmltopdf='C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe')  # Adjust path if necessary

@auth.route('/generate_course', methods=['POST'])
def generate_course():
    data = request.json
    search_term = data.get('searchTerm')
    
    # Use Cohere to generate the course content
    response = cohere_client.generate(
        model='command',
        prompt=f'Generate a comprehensive course on {search_term}.',
        max_tokens=500
    )
    
    course_content = response.generations[0].text
    
    # Save course content as PDF
    pdf_path = f"{search_term.replace(' ', '_')}.pdf"
    pdfkit.from_string(course_content, pdf_path, configuration=pdfkit_config)
    
    return jsonify({'course_content': course_content, 'pdf_path': pdf_path})

@auth.route('/user-details', methods=['GET'])
@jwt_required()
def get_user_details():
    current_user_id = get_jwt_identity()
    user_collection = mongo.db.users
    user = user_collection.find_one({"_id": current_user_id})

    if user:
        return jsonify(user), 200
    else:
        return jsonify({"message": "User not found"}), 404

# Update User Details
@auth.route('/user-details', methods=['POST'])
@jwt_required()
def save_user_details():
    current_user_id = get_jwt_identity()
    user_details = request.get_json()

    # Update user details in MongoDB
    user_collection = mongo.db.users
    result = user_collection.update_one(
        {"_id": current_user_id},
        {"$set": user_details}
    )

    if result.modified_count > 0:
        return jsonify({"message": "User details updated successfully"}), 200
    else:
        return jsonify({"message": "Failed to update user details"}), 400
    
@auth.route('/generate_video', methods=['POST'])
def generate_video():
    try:
        data = request.json
        course_content = data.get('courseContent')
        if not course_content:
            return jsonify({'error': 'No course content provided'}), 400

        # Assuming you are using a service like Elai or another for video generation
        response = requests.post(
            'https://api.example.com/v1/videos',  # Replace with actual endpoint
            headers={'Authorization': 'Bearer YOUR_API_KEY'},  # Replace with actual header if needed
            json={'courseContent': course_content}
        )

        if response.status_code == 200:
            video_url = response.json().get('video_url')
            return jsonify({'video_url': video_url})
        else:
            return jsonify({'error': 'Failed to generate video'}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500