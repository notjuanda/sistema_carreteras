import apiService from './api.service';

const municipioService = {
    crearMunicipio: async (municipioData) => {
        try {
            const response = await apiService.post('/municipios', municipioData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    listarMunicipios: async () => {
        try {
            const response = await apiService.get('/municipios');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    obtenerMunicipioPorId: async (id) => {
        try {
            const response = await apiService.get(`/municipios/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    editarMunicipio: async (id, municipioData) => {
        try {
            const response = await apiService.put(`/municipios/${id}`, municipioData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    eliminarMunicipio: async (id) => {
        try {
            const response = await apiService.delete(`/municipios/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    buscarMunicipio: async (nombre) => {
        try {
            const response = await apiService.get(`/municipios/search?nombre=${nombre}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default municipioService;
