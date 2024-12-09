// src/pages/administrador/incidente/AgregarIncidente.jsx
import { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import incidenteService from '../../../services/incidente.service';
import tipoIncidenteService from '../../../services/tipo_incidente.service';
import HeaderAdministrador from '../../../components/administrador/HeaderAdministrador';

const AgregarIncidente = () => {
    const [id_tipo_incidente, setIdTipoIncidente] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { lat, lng, id_carretera } = location.state || {};

    const [tiposIncidente, setTiposIncidente] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [nuevoTipoNombre, setNuevoTipoNombre] = useState('');

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const data = await tipoIncidenteService.getAllTiposIncidente();
                setTiposIncidente(data);
            } catch (error) {
                console.error(error);
                setError('Error al cargar los tipos de incidente.');
            }
        };
        fetchTipos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!id_carretera || !lat || !lng || !id_tipo_incidente) {
            setError('Todos los campos requeridos deben estar completos.');
            return;
        }

        const incidenteData = {
            id_carretera,
            id_tipo_incidente: parseInt(id_tipo_incidente),
            latitud: lat,
            longitud: lng,
            descripcion
        };

        try {
            await incidenteService.crearIncidente(incidenteData);
            navigate('/panel-administracion/incidentes');
        } catch (error) {
            console.error(error);
            setError('Error al crear el incidente.');
        }
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setNuevoTipoNombre('');
        setShowModal(false);
    };

    const handleCrearTipo = async () => {
        if (!nuevoTipoNombre.trim()) {
            setError('El nombre del tipo de incidente es obligatorio.');
            return;
        }
        try {
            await tipoIncidenteService.createTipoIncidente({ nombre_tipo_incidente: nuevoTipoNombre.trim() });
            const data = await tipoIncidenteService.getAllTiposIncidente();
            setTiposIncidente(data);
            setNuevoTipoNombre('');
            setShowModal(false);
        } catch (error) {
            console.error(error);
            setError('Error al crear el tipo de incidente.');
        }
    };

    return (
        <> 
            <HeaderAdministrador />
            <Container className="mt-4">
                <h2>Agregar Incidente</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo de Incidente</Form.Label>
                        <Form.Select
                            value={id_tipo_incidente}
                            onChange={(e) => setIdTipoIncidente(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un tipo de incidente</option>
                            {tiposIncidente.map((tipo) => (
                                <option key={tipo.id_tipo_incidente} value={tipo.id_tipo_incidente}>
                                    {tipo.nombre_tipo_incidente}
                                </option>
                            ))}
                        </Form.Select>
                        <Button variant="link" onClick={handleShowModal}>Agregar Nuevo Tipo</Button>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            type="text"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                    </Form.Group>
                    <p><strong>Carretera ID:</strong> {id_carretera}</p>
                    <p><strong>Lat:</strong> {lat}, <strong>Lng:</strong> {lng}</p>
                    <Button variant="primary" type="submit">
                        Crear Incidente
                    </Button>
                </Form>
            </Container>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nuevo Tipo de Incidente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group>
                        <Form.Label>Nombre del Tipo de Incidente</Form.Label>
                        <Form.Control
                            type="text"
                            value={nuevoTipoNombre}
                            onChange={(e) => setNuevoTipoNombre(e.target.value)}
                            placeholder="Ej: Accidente, Derrumbe, etc."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                    <Button variant="primary" onClick={handleCrearTipo}>Crear Tipo</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AgregarIncidente;
