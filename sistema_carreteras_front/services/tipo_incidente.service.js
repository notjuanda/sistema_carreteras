import apiService from './api.service';

const tipoIncidenteService = {
    createTipoIncidente: async (tipoIncidenteData) => {
        try {
            const response = await apiService.post('/tipos-incidente', tipoIncidenteData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getAllTiposIncidente: async () => {
        try {
            const response = await apiService.get('/tipos-incidente');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getTipoIncidenteById: async (id) => {
        try {
            const response = await apiService.get(`/tipos-incidente/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateTipoIncidente: async (id, tipoIncidenteData) => {
        try {
            const response = await apiService.put(`/tipos-incidente/${id}`, tipoIncidenteData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteTipoIncidente: async (id) => {
        try {
            const response = await apiService.delete(`/tipos-incidente/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default tipoIncidenteService;
