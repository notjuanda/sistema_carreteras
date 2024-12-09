import apiService from './api.service';

const incidenteService = {
    crearIncidente: async (incidenteData) => {
        try {
            const response = await apiService.post('/incidentes', incidenteData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    listarIncidentes: async () => {
        try {
            const response = await apiService.get('/incidentes');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    obtenerIncidentePorId: async (id) => {
        try {
            const response = await apiService.get(`/incidentes/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    editarIncidente: async (id, incidenteData) => {
        try {
            const response = await apiService.put(`/incidentes/${id}`, incidenteData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    eliminarIncidente: async (id) => {
        try {
            const response = await apiService.delete(`/incidentes/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default incidenteService;
