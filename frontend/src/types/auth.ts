export interface User {
    id: number;
    name: string;
    email: string;
    role: 'patient' | 'doctor';
}

export interface PatientRegisterData {
    name: string;
    phone_number: string;
    email: string;
    password: string;
}

export interface DoctorRegisterData {
    name: string;
    phone_number: string;
    email: string;
    specialization: string;
    password: string;
    license_number: string;
    pin: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
} 