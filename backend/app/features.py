
import speech_recognition as sr
import pyttsx3
from transformers import pipeline
recognizer = sr.Recognizer()
tts_engine = pyttsx3.init()


generator = pipeline('text-generation', model='gpt2')
# Load text generation model
model_name = "distilgpt2"  # Use a smaller model for testing
text_generator = pipeline("text-generation", model=model_name)

class LearningPath:
    def __init__(self, student_id):
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