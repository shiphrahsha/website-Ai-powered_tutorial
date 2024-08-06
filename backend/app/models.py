from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt

class User:
    def __init__(self, mongo, bcrypt):
        self.mongo = mongo
        self.bcrypt = bcrypt

    def create_user(self, username, email, password):
        password_hash = self.bcrypt.generate_password_hash(password).decode('utf-8')
        user_id = self.mongo.db.users.insert_one({
            'username': username,
            'email': email,
            'password': password_hash
        }).inserted_id
        return str(user_id)

    def find_user(self, identifier):
        user = self.mongo.db.users.find_one({'$or': [{'username': identifier}, {'email': identifier}]})
        return user

    def verify_password(self, user, password):
        return self.bcrypt.check_password_hash(user['password'], password)
