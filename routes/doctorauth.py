from flask import Blueprint, request, jsonify
from extensions import db, bcrypt
from models.doctor import Doctor, doctor_schema
from config.hospital_pins import validate_pin
import jwt
import datetime
import os
import re
from dotenv import load_dotenv

doctor_auth_bp = Blueprint('doctorauth', __name__)

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

def create_token(doctor_id, email):
    if SECRET_KEY is None:
        raise ValueError("SECRET_KEY is not set in environment variables")
    
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=4),
        'iat': datetime.datetime.utcnow(),
        'sub': str(doctor_id),
        'email': email,
        'role': 'doctor'
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

@doctor_auth_bp.route('/registerdoctor', methods=['POST'])
def register_doctor():
    try:
        data = request.json
        # Check if all required fields are present
        required_fields = ["name", "phone_number", "email", "specialization", "password", "pin", "license_number"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "All fields are required"}), 400

        # Validate the hospital PIN code
        if not validate_pin(data["pin"]):
            return jsonify({"error": "Invalid hospital PIN code"}), 403

        # Validate license number format
        if not Doctor.validate_license_number(data["license_number"]):
            return jsonify({"error": "Invalid license number format. Must be 2 letters followed by 6 digits"}), 400

        # Check if email already exists
        if Doctor.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already registered"}), 400
            
        # Check if license number already exists
        if Doctor.query.filter_by(license_number=data["license_number"]).first():
            return jsonify({"error": "License number already registered"}), 400

        # Create new doctor
        try:
            new_doctor = Doctor(
                name=data["name"],
                phone_number=data["phone_number"],
                email=data["email"],
                specialization=data["specialization"],
                password=data["password"],
                license_number=data["license_number"]
            )
        except Exception as e:
            print(f"Error creating doctor object: {str(e)}")
            return jsonify({"error": f"Error creating doctor: {str(e)}"}), 500
        
        try:
            db.session.add(new_doctor)
            db.session.commit()
        except Exception as e:
            print(f"Database error: {str(e)}")
            db.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        
        # Create token for immediate login
        token = create_token(new_doctor.id, new_doctor.email)

        return jsonify({
            "message": "Registration successful",
            "doctor": doctor_schema.dump(new_doctor),
            "token": token
        }), 201
    except Exception as e:
        print(f"Error registering doctor: {str(e)}")
        db.session.rollback()
        return jsonify({"error": f"Failed to register doctor: {str(e)}"}), 500

@doctor_auth_bp.route('/logindoctor', methods=['POST'])
def login_doctor():
    try:
        data = request.json
        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email and password are required"}), 400

        doctor = Doctor.query.filter_by(email=data["email"]).first()
        if not doctor:
            return jsonify({"error": "Invalid email or password"}), 403

        if not bcrypt.check_password_hash(doctor.hashed_password, data["password"]):
            return jsonify({"error": "Invalid email or password"}), 403

        token = create_token(doctor.id, doctor.email)
        return jsonify({
            "message": "Login successful",
            "doctor": doctor_schema.dump(doctor),
            "token": token
        }), 200
    except Exception as e:
        print(f"Authentication error: {str(e)}")
        return jsonify({"error": "Authentication failed"}), 500 