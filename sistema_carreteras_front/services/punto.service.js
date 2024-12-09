import apiService from './api.service';

const puntoService = {
    crearPunto: async (puntoData) => {
        try {
            const response = await apiService.post('/puntos', puntoData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    listarPuntosPorCarretera: async (idCarretera) => {
        try {
            const response = await apiService.get(`/puntos/carretera/${idCarretera}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    obtenerPuntoPorId: async (id) => {
        try {
            const response = await apiService.get(`/puntos/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    editarPunto: async (id, puntoData) => {
        try {
            const response = await apiService.put(`/puntos/${id}`, puntoData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    eliminarPunto: async (id) => {
        try {
            const response = await apiService.delete(`/puntos/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default puntoService;
