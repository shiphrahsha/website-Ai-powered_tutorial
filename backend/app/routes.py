import io
import uuid
from flask import Blueprint, current_app, request, jsonify, send_file, send_from_directory
from pymongo import MongoClient
import requests
from .features import generate_course_content, generate_learning_path, generate_response, listen_to_audio, speak_text, synthesize_text
from .models import User
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from . import mongo, bcrypt
from textblob import TextBlob
from transformers import pipeline
import cohere
import pdfkit
from gtts import gTTS
from google.cloud import texttospeech
import speech_recognition as sr
from pydub import AudioSegment
import subprocess

import os

print(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))



cohere_client = cohere.Client('sUXLO3qVlYhG7a5KuY92bxGfycL30QrBNGD0QnQh')
D_ID_API_KEY = 'YW5hbmRoYXByYWtha3NoQGdtYWlsLmNvbQ:-bljFC9EOmCJRiEQSwc6G'
google_tts_client = texttospeech.TextToSpeechClient()



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

@auth.route('/analyze-feedback', methods=['POST'])
def analyze_feedback():
    data = request.json
    feedback = data.get('feedback', '')
    name = data.get('name', '')
    email = data.get('email', '')

    # Perform sentiment analysis
    analysis = TextBlob(feedback)
    polarity = analysis.sentiment.polarity

    # Determine the sentiment category
    if polarity > 0:
        sentiment = 'Positive'
    elif polarity == 0:
        sentiment = 'Neutral'
    else:
        sentiment = 'Negative'

    # Save feedback to MongoDB
    feedback_entry = {
        'name': name,
        'email': email,
        'feedback': feedback,
        'sentiment': sentiment,
        'polarity': polarity
    }
    mongo.db.feedback.insert_one(feedback_entry)

    # Respond with the sentiment result
    response = {
        'sentiment': sentiment,
        'polarity': polarity
    }
    return jsonify(response)

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

AUDIO_FOLDER = os.path.join(os.getcwd(), 'static', 'audio')
if not os.path.exists(AUDIO_FOLDER):
    os.makedirs(AUDIO_FOLDER)

@auth.route('/generate_course', methods=['POST'])
def generate_course():
    data = request.json
    search_term = data.get('searchTerm')
    
    prompt = (
        f"Generate a detailed and comprehensive course on {search_term}. "
        "The course should cover multiple aspects including theory, practical examples, "
        "and include summaries and exercises. The content should be detailed enough to fill at "
        "least two pages and be neatly aligned with appropriate headings and subheadings."
    )
    
    # Use Cohere to generate the course content
    response = cohere_client.generate(
        model='command',
        prompt=prompt,
        max_tokens=1500,
    )
    
    course_content = response.generations[0].text
    
    # Format the course content with HTML
    formatted_content = f"""
    <h1>Course on {search_term}</h1>
    {course_content.replace('/n', '<br/>')}
    """
    
    pdf_filename = f"{search_term.replace(' ', '_')}.pdf"
    pdf_path = os.path.join('static', 'pdfs', pdf_filename)
    
    # Ensure the directory exists
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
    
    pdfkit.from_string(formatted_content, pdf_path, configuration=pdfkit_config)
    

    # Convert course content to speech
    audio_filename = f"{search_term.replace(' ', '_')}.mp3"
    audio_path = os.path.join(AUDIO_FOLDER, audio_filename)
    tts = gTTS(text=course_content, lang='en', slow=False)
    tts.save(audio_path)
    
    return jsonify({'course_content': formatted_content, 'pdf_path': pdf_path, 'audio_path': f'audio/{audio_filename}'})

@auth.route('/audio/<filename>')
def serve_audio(filename):
    return send_from_directory(AUDIO_FOLDER, filename)

@auth.route('/pdfs/<filename>', methods=['GET'])
def download_pdf(filename):
    return send_from_directory(os.path.join('static', 'pdfs'), filename)
    

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
    
meetings = mongo.db.meetings
    
@auth.route('/create_meeting', methods=['POST'])
def create_meeting():
    meeting_id = str(uuid.uuid4())
    meetings.insert_one({'meeting_id': meeting_id})
    return jsonify({'status': 'success', 'meeting_id': meeting_id}), 201

@auth.route('/join_meeting', methods=['POST'])
def join_meeting():
    data = request.json
    meeting_id = data.get('meeting_id')
    
    if meetings.find_one({'meeting_id': meeting_id}):
        return jsonify({'status': 'success', 'message': 'Connected to meeting', 'meeting_id': meeting_id}), 200
    else:
        return jsonify({'status': 'failure', 'message': 'Invalid Meeting ID'}), 404
    
client = MongoClient('mongodb://localhost:27017/')
db = client['meeting_db']
meetings_collection = db['meetings']

@auth.route('/start_presenting', methods=['POST'])
def start_presenting():
    data = request.json
    presenting = data.get('presenting', False)

    if presenting:
        # Update the meeting state in the database
        # Assuming you have a meeting ID stored in the session or sent in the request
        meeting_id = request.args.get('meeting_id')
        if meeting_id:
            meetings_collection.update_one(
                {'meeting_id': meeting_id},
                {'$set': {'is_presenting': True}}
            )
            return jsonify({"message": "Started presenting."}), 200
        else:
            return jsonify({"message": "Meeting ID is required."}), 400
    else:
        return jsonify({"message": "Invalid request."}), 400
    


@auth.route('/convert-voice-to-text', methods=['POST'])
def convert_voice_to_text():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file found in request'}), 400

    audio_file = request.files['audio']
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 'recording.wav')

    # Delete the file if it already exists to ensure it can be overwritten
    if os.path.exists(file_path):
        os.remove(file_path)

    audio_file.save(file_path)

    try:
        # Call the function that processes the audio file
        response_audio_path = convert_to_text(file_path)

        # Check if the file exists before sending
        if not os.path.exists(response_audio_path):
            return jsonify({'error': 'Response audio file not found'}), 404

        # Return the audio file
        return send_file(response_audio_path, mimetype='audio/mpeg')
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def convert_to_text(file_path):
    # Define the path to the ffmpeg executable
    ffmpeg_path = 'D:\\ffmpeg-2024-08-21-git-9d15fe77e3-full_build\\bin\\ffmpeg.exe'
    pcm_file_path = file_path.replace('.wav', '_converted.wav')

    # Convert file to PCM WAV using ffmpeg
    try:
        subprocess.run([ffmpeg_path, '-y', '-i', file_path, '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1', pcm_file_path], check=True)
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"FFmpeg error: {e}")

    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(pcm_file_path) as source:
            audio_data = recognizer.record(source)
            transcribed_text = recognizer.recognize_google(audio_data)
    except sr.UnknownValueError:
        raise RuntimeError("Google Speech Recognition could not understand audio")
    except sr.RequestError as e:
        raise RuntimeError(f"Could not request results from Google Speech Recognition service; {e}")
    except Exception as e:
        raise RuntimeError(f"Speech recognition error: {e}")

    try:
        response = cohere_client.generate(
            model='command',
            prompt=transcribed_text,
            max_tokens=100,)
        cohere_response = response.generations[0].text.strip()
    except cohere.CohereError as e:
        raise RuntimeError(f"Cohere API error: {e}")

    # Convert the Cohere response to voice output
    response_audio_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 'D:\\Ai powered tutoring\\ai tutoring be\\AI-Powered-tutorial-platform-website\\backend\\uploads\\response.mp3')
    try:
        tts = gTTS(cohere_response, lang='en')
        tts.save(response_audio_path)
    except Exception as e:
        raise RuntimeError(f"Text-to-speech conversion error: {e}")

    return response_audio_path