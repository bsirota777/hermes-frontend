import axios from 'axios';

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081';
const DELIVERY_SERVICE_URL = import.meta.env.VITE_DELIVERY_SERVICE_URL || 'http://localhost:8084';

function createApiClient(baseURL) {
    const instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Attach JWT to every outgoing request, if we have one
    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('hermes_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // If the token is invalid/expired, the API will return 401 — clean up locally
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('hermes_token');
            }
            return Promise.reject(error);
        }
    );

    return instance;
}

// user-service: auth, account, driver profile, admin/users
export const userApiClient = createApiClient(USER_SERVICE_URL);

// delivery-service: deliveries, queue, admin/deliveries
export const deliveryApiClient = createApiClient(DELIVERY_SERVICE_URL);

// Default export kept for backwards compatibility - points at user-service,
// which is where the pre-split monolith's auth/account endpoints now live.
export default userApiClient;
