from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from db_config import DB_CONFIG
import datetime

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DB_CONFIG
db = SQLAlchemy(app)

@app.route("/hello", methods=["GET"])
def hello():
    return "Hello, World!"


if __name__ == "__main__":
    app.run(debug=True)