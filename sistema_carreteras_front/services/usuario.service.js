import Cookies from 'js-cookie';
import apiService from './api.service';

const UsuarioService = {
    login: async (email, contraseña) => {
        const response = await apiService.post('/usuarios/login', { email, contraseña });
        
        if (response.data.token) {
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 6);

            Cookies.set('authToken', response.data.token, {
                secure: true,
                sameSite: 'Strict',
                expires: expirationDate
            });

            Cookies.set('user', JSON.stringify(response.data.usuario), {
                secure: true,
                sameSite: 'Strict',
                expires: expirationDate
            });
        }

        return response.data;
    },

    logout: () => {
        Cookies.remove('authToken');
        Cookies.remove('user');
    },

    createUser: async (userData) => {
        const response = await apiService.post('/usuarios', userData);
        return response.data;
    },

    getAllUsers: async () => {
        const response = await apiService.get('/usuarios');
        return response.data;
    },

    getUserById: async (id) => {
        const response = await apiService.get(`/usuarios/${id}`);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await apiService.put(`/usuarios/${id}`, userData);
        return response.data;
    },

    changePassword: async (id, newPassword) => {
        const response = await apiService.patch(`/usuarios/${id}/contrasenia`, { contraseña: newPassword });
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await apiService.delete(`/usuarios/${id}`);
        return response.data;
    }
};

export default UsuarioService;
