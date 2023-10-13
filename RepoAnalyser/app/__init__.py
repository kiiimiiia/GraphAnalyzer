from flask import Flask
from flask_cors import CORS

from app.routes import blueprint

app = Flask(__name__)
CORS(app, resources={r"/mine_repo": {"origins": "http://localhost:3000"}})
CORS(app, resources={r"/mine_repo_with_date": {"origins": "http://localhost:3000"}})
app.register_blueprint(blueprint)