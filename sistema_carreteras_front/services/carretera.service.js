import apiService from './api.service';

const carreteraService = {
    crearCarretera: async (data) => {
        try {
            const response = await apiService.post('/carreteras', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    obtenerCarreteras: async () => {
        try {
            const response = await apiService.get('/carreteras');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    obtenerCarreteraPorId: async (id) => {
        try {
            const response = await apiService.get(`/carreteras/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    obtenerCarreterasPublicas: async () => {
        try {
            const response = await apiService.get('/carreteras/public');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    obtenerCarreterasPorMunicipio: async (municipio_id) => {
        try {
            const response = await apiService.get(`/carreteras/municipio/${municipio_id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    actualizarCarretera: async (id, data) => {
        try {
            const response = await apiService.put(`/carreteras/${id}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    eliminarCarretera: async (id) => {
        try {
            const response = await apiService.delete(`/carreteras/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default carreteraService;
