import axios from 'axios';
import { PatientRegisterData, DoctorRegisterData, LoginData, AuthResponse } from '../types/auth';

const API_URL = 'http://localhost:5000';

const authService = {
    // Patient Authentication
    registerPatient: async (data: PatientRegisterData): Promise<AuthResponse> => {
        const response = await axios.post(`${API_URL}/registerpatient`, data);
        return response.data;
    },

    loginPatient: async (data: LoginData): Promise<AuthResponse> => {
        const response = await axios.post(`${API_URL}/loginpatient`, data);
        return response.data;
    },

    // Doctor Authentication
    registerDoctor: async (data: DoctorRegisterData): Promise<AuthResponse> => {
        const response = await axios.post(`${API_URL}/registerdoctor`, data);
        return response.data;
    },

    loginDoctor: async (data: LoginData): Promise<AuthResponse> => {
        const response = await axios.post(`${API_URL}/logindoctor`, data);
        return response.data;
    },

    // Set auth token in localStorage
    setAuthToken: (token: string) => {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    // Remove auth token
    removeAuthToken: () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    },

    // Get auth token
    getAuthToken: (): string | null => {
        return localStorage.getItem('token');
    }
};

export default authService; 