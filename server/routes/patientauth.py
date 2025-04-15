from flask import Blueprint, request, jsonify
from extensions import db, bcrypt
from models.patient import Patient, patient_schema
import jwt
import datetime
import os
from dotenv import load_dotenv

patient_auth_bp = Blueprint('patientauth', __name__)

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

def create_token(patient_id, email):
    if SECRET_KEY is None:
        raise ValueError("SECRET_KEY is not set in environment variables")
    
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=4),
        'iat': datetime.datetime.utcnow(),
        'sub': str(patient_id),
        'email': email
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

@patient_auth_bp.route('/registerpatient', methods=['POST'])
def register_patient():
    try:
        data = request.json
        # Check if all required fields are present
        required_fields = ["name", "phone_number", "email", "password"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "All fields are required"}), 400

        # Check if email already exists
        if Patient.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already registered"}), 400

        # Create new patient
        try:
            new_patient = Patient(
                name=data["name"],
                phone_number=data["phone_number"],
                email=data["email"],
                password=data["password"]
            )
        except Exception as e:
            print(f"Error creating patient object: {str(e)}")
            return jsonify({"error": f"Error creating patient: {str(e)}"}), 500
        
        try:
            db.session.add(new_patient)
            db.session.commit()
        except Exception as e:
            print(f"Database error: {str(e)}")
            db.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        
        # Create token for immediate login
        token = create_token(new_patient.id, new_patient.email)

        return jsonify({
            "message": "Registration successful",
            "patient": patient_schema.dump(new_patient),
            "token": token
        }), 201
    except Exception as e:
        print(f"Error registering patient: {str(e)}")
        db.session.rollback()
        return jsonify({"error": f"Failed to register patient: {str(e)}"}), 500

@patient_auth_bp.route('/loginpatient', methods=['POST'])
def login_patient():
    try:
        data = request.json
        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email and password are required"}), 400

        patient = Patient.query.filter_by(email=data["email"]).first()
        if not patient:
            return jsonify({"error": "Invalid email or password"}), 403

        if not bcrypt.check_password_hash(patient.hashed_password, data["password"]):
            return jsonify({"error": "Invalid email or password"}), 403

        token = create_token(patient.id, patient.email)
        return jsonify({
            "message": "Login successful",
            "patient": patient_schema.dump(patient),
            "token": token
        }), 200
    except Exception as e:
        print(f"Authentication error: {str(e)}")
        return jsonify({"error": "Authentication failed"}), 500 