import { useState, useEffect } from 'react';
import { Table, Button, Container, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import solicitudIncidenteService from '../../../services/solicitud_incidente.service';
import HeaderAdministrador from '../../../components/administrador/HeaderAdministrador';

const ListaSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [error, setError] = useState('');
    const [actualizandoId, setActualizandoId] = useState(null); 
    const [nuevoEstado, setNuevoEstado] = useState({}); 

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const data = await solicitudIncidenteService.getAllSolicitudes();
                setSolicitudes(data);
            } catch (error) {
                console.error(error);
                setError('Error al obtener la lista de solicitudes de incidente.');
            }
        };
        fetchSolicitudes();
    }, []);

    const handleEstadoChange = (id_solicitud, estado) => {
        setNuevoEstado((prev) => ({ ...prev, [id_solicitud]: estado }));
    };

    const handleActualizarEstado = async (id_solicitud) => {
        const estado = nuevoEstado[id_solicitud];
        if (!estado) {
            setError('Debe seleccionar un estado antes de actualizar.');
            return;
        }

        try {
            setActualizandoId(id_solicitud);
            await solicitudIncidenteService.updateSolicitud(id_solicitud, { descripcion: '', estado }, null);
            setSolicitudes((prev) =>
                prev.map((sol) => (sol.id_solicitud === id_solicitud ? { ...sol, estado } : sol))
            );
            setActualizandoId(null);

            if (estado === 'atendido') {
                navigate('/panel-administracion/incidentes/agregar');
            }
        } catch (error) {
            console.error(error);
            setError('Error al actualizar el estado de la solicitud.');
            setActualizandoId(null);
        }
    };

    const handleEliminar = async (id_solicitud) => {
        if (window.confirm('¿Estás seguro de eliminar esta solicitud?')) {
            try {
                await solicitudIncidenteService.deleteSolicitud(id_solicitud);
                setSolicitudes((prev) => prev.filter((sol) => sol.id_solicitud !== id_solicitud));
            } catch (error) {
                console.error(error);
                setError('Error al eliminar la solicitud.');
            }
        }
    };

    return (
        <>
            <HeaderAdministrador />
            <Container className="mt-4">
                <h2>Lista de Solicitudes de Incidente</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {solicitudes.length === 0 ? (
                    <p>No hay solicitudes disponibles.</p>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Descripción</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Foto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudes.map((sol) => (
                                <tr key={sol.id_solicitud}>
                                    <td>{sol.id_solicitud}</td>
                                    <td>{sol.descripcion}</td>
                                    <td>{new Date(sol.fecha).toLocaleString()}</td>
                                    <td>
                                        <Form.Select
                                            value={nuevoEstado[sol.id_solicitud] || sol.estado}
                                            onChange={(e) => handleEstadoChange(sol.id_solicitud, e.target.value)}
                                        >
                                            <option value="pendiente">Pendiente</option>
                                            <option value="en proceso">En Proceso</option>
                                            <option value="atendido">Atendido</option>
                                        </Form.Select>
                                    </td>
                                    <td>
                                        {sol.url_foto ? (
                                            <img
                                                src={`http://localhost:3000${sol.url_foto}`}
                                                alt="Foto Solicitud"
                                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                                            />
                                        ) : (
                                            'Sin foto'
                                        )}
                                    </td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleActualizarEstado(sol.id_solicitud)}
                                            disabled={actualizandoId === sol.id_solicitud}
                                        >
                                            {actualizandoId === sol.id_solicitud ? 'Actualizando...' : 'Actualizar Estado'}
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => handleEliminar(sol.id_solicitud)}>
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </>
    );
};

export default ListaSolicitudes;
