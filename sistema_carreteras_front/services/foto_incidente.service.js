import apiService from './api.service';

const fotoIncidenteService = {
    crearFotoIncidente: async (data) => {
        try {
            const response = await apiService.post('/fotos-incidente', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    obtenerFotosDeIncidente: async (id_incidente) => {
        try {
            const response = await apiService.get(`/fotos-incidente/${id_incidente}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    eliminarFotoIncidente: async (id) => {
        try {
            const response = await apiService.delete(`/fotos-incidente/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default fotoIncidenteService;
