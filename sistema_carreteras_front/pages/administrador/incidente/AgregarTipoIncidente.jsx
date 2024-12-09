import { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import tipoIncidenteService from '../../../services/tipo_incidente.service';
import HeaderAdministrador from '../../../components/administrador/HeaderAdministrador';

const AgregarTipoIncidente = () => {
    const [nombre_tipo_incidente, setNombreTipoIncidente] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre_tipo_incidente.trim()) {
            setError('El nombre del tipo de incidente es obligatorio.');
            return;
        }

        try {
            await tipoIncidenteService.createTipoIncidente({ nombre_tipo_incidente: nombre_tipo_incidente.trim() });
            navigate('/panel-administracion/incidentes/tipos');
        } catch (error) {
            console.error(error);
            setError('Error al crear el tipo de incidente.');
        }
    };

    return (
        <>
            <HeaderAdministrador />
            <Container className="mt-4">
                <h2>Agregar Tipo de Incidente</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre del Tipo de Incidente</Form.Label>
                        <Form.Control
                            type="text"
                            value={nombre_tipo_incidente}
                            onChange={(e) => setNombreTipoIncidente(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Crear Tipo de Incidente
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default AgregarTipoIncidente;
