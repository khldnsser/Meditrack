import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/auth';
import authService from '../services/authService';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string, role: 'patient' | 'doctor') => Promise<void>;
    register: (data: any, role: 'patient' | 'doctor') => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = authService.getAuthToken();
        if (token) {
            // TODO: Implement token validation and user fetching
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string, role: 'patient' | 'doctor') => {
        try {
            setLoading(true);
            setError(null);
            const response = role === 'patient' 
                ? await authService.loginPatient({ email, password })
                : await authService.loginDoctor({ email, password });
            
            authService.setAuthToken(response.token);
            setUser(response.user);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: any, role: 'patient' | 'doctor') => {
        try {
            setLoading(true);
            setError(null);
            const response = role === 'patient'
                ? await authService.registerPatient(data)
                : await authService.registerDoctor(data);
            
            authService.setAuthToken(response.token);
            setUser(response.user);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.removeAuthToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 