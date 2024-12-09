import apiService from './api.service';

const solicitudIncidenteService = {
    createSolicitudIncidente: async (solicitudData, imagen) => {
        try {
            const formData = new FormData();
            formData.append('descripcion', solicitudData.descripcion);
            formData.append('imagen', imagen);

            const response = await apiService.post('/solicitudes-incidente/public', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getAllSolicitudes: async () => {
        try {
            const response = await apiService.get('/solicitudes-incidente');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getSolicitudById: async (id) => {
        try {
            const response = await apiService.get(`/solicitudes-incidente/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateSolicitud: async (id, solicitudData, imagen) => {
        try {
            const formData = new FormData();
            formData.append('descripcion', solicitudData.descripcion);
            formData.append('estado', solicitudData.estado);
            if (imagen) {
                formData.append('imagen', imagen);
            }

            const response = await apiService.put(`/solicitudes-incidente/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteSolicitud: async (id) => {
        try {
            const response = await apiService.delete(`/solicitudes-incidente/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default solicitudIncidenteService;
