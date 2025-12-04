import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Setup Axios defaults
    axios.defaults.withCredentials = true;
    // axios.defaults.baseURL = 'http://localhost:5000'; // Removed in favor of Vite Proxy

    const checkAuth = async () => {
        try {
            // We don't have a specific /me endpoint yet, but maybe use /auth if it supports GET?
            // Or just rely on stored user in local storage if we used it?
            // For now, let's assume we maintain session via cookie and maybe specific endpoint to fetch user?
            // Since I didn't create a 'get current user' endpoint, let's just use local state after login for now
            // or implement persists via localStorage for the user info (non-sensitive).

            const storedUser = localStorage.getItem('userInfo');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/users/auth', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (username, email, password) => {
        try {
            const { data } = await axios.post('/api/users/register', { username, email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const guestLogin = async () => {
        try {
            const { data } = await axios.post('/api/users/guest');
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            console.error("Guest login error:", error);
            return { success: false, message: error.response?.data?.message || 'Guest login failed' };
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/users/logout');
            setUser(null);
            localStorage.removeItem('userInfo');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, guestLogin }}>
            {children}
        </AuthContext.Provider>
    );
};
