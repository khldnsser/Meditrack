from sqlalchemy.orm import Mapped, mapped_column
from extensions import db, ma, bcrypt

class Patient(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(db.String(100))
    phone_number: Mapped[str] = mapped_column(db.String(8))
    email: Mapped[str] = mapped_column(db.String(120), unique=True)
    hashed_password: Mapped[str] = mapped_column(db.String(128))

    def __init__(self, name, phone_number, email, password):
        super(Patient, self).__init__(
            name=name,
            phone_number=phone_number,
            email=email
        )
        self.hashed_password = bcrypt.generate_password_hash(password)

class PatientSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "phone_number", "email")
        model = Patient

patient_schema = PatientSchema()
patients_schema = PatientSchema(many=True)


