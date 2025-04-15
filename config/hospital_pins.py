# Hospital registration PIN code for doctors
# This is a 4-digit PIN code that is required for doctor registration
# Only doctors with this PIN code can register an account

HOSPITAL_PIN = "1234"  # Replace with your actual PIN code

def validate_pin(pin):
    """Validate if the provided PIN matches the hospital PIN"""
    return pin == HOSPITAL_PIN 