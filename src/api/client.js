import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT to every outgoing request, if we have one
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('hermes_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// If the token is invalid/expired, the API will return 401 — clean up locally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('hermes_token');
        }
        return Promise.reject(error);
    }
);

export default apiClient;