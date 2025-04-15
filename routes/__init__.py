from .hello import hello_bp
from .patientauth import patient_auth_bp
from .doctorauth import doctor_auth_bp

__all__ = ["hello_bp", "patient_auth_bp", "doctor_auth_bp"]