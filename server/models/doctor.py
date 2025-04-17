from sqlalchemy.orm import Mapped, mapped_column
from extensions import db, ma, bcrypt
import re

class Doctor(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(db.String(100))
    phone_number: Mapped[str] = mapped_column(db.String(8))
    email: Mapped[str] = mapped_column(db.String(120), unique=True)
    specialization: Mapped[str] = mapped_column(db.String(100))
    hashed_password: Mapped[str] = mapped_column(db.String(128))
    license_number: Mapped[str] = mapped_column(db.String(8), unique=True)

    def __init__(self, name, phone_number, email, specialization, password, license_number):
        super(Doctor, self).__init__(
            name=name,
            phone_number=phone_number,
            email=email,
            specialization=specialization,
            license_number=license_number
        )
        self.hashed_password = bcrypt.generate_password_hash(password)
    
    @staticmethod
    def validate_license_number(license_number):
        """Validate license number format: 2 letters followed by 6 digits"""
        pattern = r'^[A-Za-z]{2}\d{6}$'
        return bool(re.match(pattern, license_number))

class DoctorSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "phone_number", "email", "specialization", "license_number")
        model = Doctor

doctor_schema = DoctorSchema()
doctors_schema = DoctorSchema(many=True) 