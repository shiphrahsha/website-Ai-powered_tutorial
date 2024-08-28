

import speech_recognition as sr
import pyttsx3
from transformers import pipeline
recognizer = sr.Recognizer()
tts_engine = pyttsx3.init()
from google.cloud import texttospeech
from google.cloud import speech



generator = pipeline('text-generation', model='gpt2')
# Load text generation model
model_name = "distilgpt2"  # Use a smaller model for testing
text_generator = pipeline("text-generation", model=model_name)

def speech_to_text(audio_file):
    client = speech.SpeechClient()

    with open(audio_file, 'rb') as audio:
        audio_content = audio.read()

    audio = speech.RecognitionAudio(content=audio_content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US"
    )

    response = client.recognize(config=config, audio=audio)

    for result in response.results:
        return result.alternatives[0].transcript


def text_to_speech(text, output_file):
    client = texttospeech.TextToSpeechClient()
    input_text = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US", 
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    response = client.synthesize_speech(
        input=input_text, 
        voice=voice, 
        audio_config=audio_config
    )
    
    with open(output_file, 'wb') as out:
        out.write(response.audio_content)

class LearningPath:
    def _init_(self, student_id):
        self.student_id = student_id
        self.path = []

    def add_topic(self, topic):
        self.path.append(topic)

    def get_path(self):
        return self.path



def generate_learning_path(student_id, performance_data, sentiment):
    learning_path = LearningPath(student_id)
    if sentiment < 0:
        # Student is struggling, add easier topics or review sessions
        learning_path.add_topic('Review Basic Concepts')
    elif performance_data['score'] < 50:
        # Poor performance, add remedial topics
        learning_path.add_topic('Remedial')
    else:
        # Good performance, add advanced topics
        learning_path.add_topic('Advanced')

    return learning_path.get_path()

def listen_to_audio():
    with sr.Microphone() as source:
        print("Listening...")
        audio = recognizer.listen(source)
        try:
            print("Recognizing...")
            text = recognizer.recognize_google(audio)
            print(f"Recognized Text: {text}")
            return text
        except sr.UnknownValueError:
            print("Could not understand audio")
            return None
        except sr.RequestError as e:
            print(f"Could not request results; {e}")
            return None
        
def generate_response(text):
    response = text_generator(text, max_length=150, num_return_sequences=1)
    answer = response[0]['generated_text'].strip()
    return answer

def speak_text(text):
    tts_engine.say(text)
    tts_engine.runAndWait()


def generate_course_content(topic):
    prompt = f"Create a detailed and well-explained course on {topic}."
    response = generator(prompt, max_length=500, num_return_sequences=1)
    content = response[0]['generated_text']
    return {
        "title": f"Course on {topic}",
        "content": content
    }
    
def synthesize_text(text, output_filename):
    client = texttospeech.TextToSpeechClient()

    def chunk_text(text, max_size):
        """Splits text into chunks under the specified size."""
        chunks = []
        while len(text.encode('utf-8')) > max_size:
            split_at = text[:max_size].rfind(' ')
            if split_at == -1:
                split_at = max_size
            chunks.append(text[:split_at])
            text = text[split_at:]
        chunks.append(text)
        return chunks

    chunks = chunk_text(text, 5000)

    audio_contents = []
    for chunk in chunks:
        synthesis_input = texttospeech.SynthesisInput(text=chunk)
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )
        audio_contents.append(response.audio_content)

    with open(output_filename, "wb") as out:
        for audio_content in audio_contents:
            out.write(audio_content)