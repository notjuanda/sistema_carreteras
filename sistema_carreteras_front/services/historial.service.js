import apiService from './api.service';

const historialService = {
    obtenerHistorial: async (params) => {
        try {
            const response = await apiService.get('/historial', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    obtenerHistorialCambios: async () => {
        try {
            const response = await apiService.get('/historial/cambios');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default historialService;
