import axios from 'axios';

const SESSION_KEY = 'session_token';

const api = axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8081'),
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    // Use sessionStorage instead of localStorage for session-based auth
    const token = typeof window !== 'undefined' ? sessionStorage.getItem(SESSION_KEY) : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;
        const url = error.config?.url || '';
        
        // Only logout on 401 for protected routes (not public routes or payment callbacks)
        const isProtectedRoute = url.includes('/profile') || 
                                  url.includes('/dashboard') || 
                                  url.includes('/credits/balance') ||
                                  url.includes('/conversions');
        
        if (typeof window !== 'undefined' && status === 401 && isProtectedRoute) {
            try {
                sessionStorage.removeItem(SESSION_KEY);
                localStorage.removeItem('token');
            } catch (e) {
                // ignore
            }
            window.location.href = '/auth/login';
            return Promise.resolve();
        }
        
        return Promise.reject(error);
    }
);

export default api;

