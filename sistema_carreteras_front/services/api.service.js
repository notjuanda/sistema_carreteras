import axios from 'axios';
import Cookies from 'js-cookie';

const apiService = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
});

apiService.interceptors.request.use(
    (config) => {
        const token = Cookies.get('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.headers['Content-Type'] === 'multipart/form-data') {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiService.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('No autorizado. Redirigiendo al login...');
        }
        return Promise.reject(error);
    }
);

export default apiService;
