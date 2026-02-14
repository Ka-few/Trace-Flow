import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Surface domain errors from backend
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';

        // In a real ERP, we might use a toast system here
        console.error('API Error:', message);

        if (error.response?.status === 401) {
            // Handle unauthorized
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
