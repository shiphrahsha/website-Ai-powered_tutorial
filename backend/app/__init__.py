print("Importing necessary modules")

from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from .config import Config


print("Modules imported")

mongo = PyMongo()
bcrypt = Bcrypt()
jwt = JWTManager()

print("Extensions initialized")

def create_app():
    print("Creating app")
    app = Flask(__name__)
    CORS(app) 
    app.config.from_object(Config)

    mongo.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    from .routes import auth
    app.register_blueprint(auth)

    return app
