import { createContext, useContext, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../api/client';

const AuthContext = createContext(null);

function decodeRole(token) {
    if (!token) return null;
    try {
        return jwtDecode(token).role ?? null;
    } catch {
        return null;
    }
}

function decodeEmail(token) {
    if (!token) return null;
    try {
        return jwtDecode(token).sub ?? null; // JwtService sets email as the JWT "subject"
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('hermes_token'));
    const [role, setRole] = useState(() => decodeRole(localStorage.getItem('hermes_token')));
    const [email, setEmail] = useState(() => decodeEmail(localStorage.getItem('hermes_token')));

    const login = useCallback(async (email, password) => {
        const response = await apiClient.post('/login', { email, password });
        const { token: newToken } = response.data;
        const newRole = decodeRole(newToken);
        const newEmail = decodeEmail(newToken);
        localStorage.setItem('hermes_token', newToken);
        setToken(newToken);
        setRole(newRole);
        setEmail(newEmail);
        return { token: newToken, role: newRole, email: newEmail };
    }, []);

    const register = useCallback(async (name, email, password) => {
        const response = await apiClient.post('/users', { name, email, password });
        return response.data;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('hermes_token');
        setToken(null);
        setRole(null);
        setEmail(null);
    }, []);

    const value = {
        token,
        role,
        email,
        isAuthenticated: !!token,
        isAdmin: role === 'ADMIN',
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}