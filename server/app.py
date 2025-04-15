from flask import Flask
from db_config import DB_CONFIG
from extensions import db, ma, bcrypt
from flask_cors import CORS
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from routes import hello_bp


load_dotenv()



app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DB_CONFIG


# Initialize extensions
db.init_app(app)
ma.init_app(app)
bcrypt.init_app(app)

# Enable CORS
CORS(app, supports_credentials=True)

# Initialize rate limiting
limiter = Limiter(app=app, key_func=get_remote_address)


#register blueprints
app.register_blueprint(hello_bp)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)