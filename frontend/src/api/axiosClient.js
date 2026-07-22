import axios from 'axios';

const isProduction = import.meta.env.PROD;
const defaultBaseURL = isProduction
    ? window.location.origin
    : 'http://localhost:5000';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    const token = userInfo?.token;
    config.headers = config.headers || {};
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('userInfo');
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
