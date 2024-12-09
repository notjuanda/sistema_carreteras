import { useState, useEffect } from 'react';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import tipoIncidenteService from '../../../services/tipo_incidente.service';
import { useNavigate } from 'react-router-dom';
import HeaderAdministrador from '../../../components/administrador/HeaderAdministrador';

const ListaTipoIncidente = () => {
    const [tipos, setTipos] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const data = await tipoIncidenteService.getAllTiposIncidente();
                setTipos(data);
            } catch (error) {
                console.error(error);
                setError('Error al obtener la lista de tipos de incidente.');
            }
        };
        fetchTipos();
    }, []);

    const handleAgregarTipo = () => {
        navigate('/panel-administracion/incidentes/tipo/agregar');
    };

    const handleEditar = (id) => {
        navigate(`/panel-administracion/incidentes/tipo/editar/${id}`);
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este tipo de incidente?')) {
            try {
                await tipoIncidenteService.deleteTipoIncidente(id);
                setTipos((prev) => prev.filter((t) => t.id_tipo_incidente !== id));
            } catch (error) {
                console.error(error);
                setError('Error al eliminar el tipo de incidente.');
            }
        }
    };

    return (
        <>
            <HeaderAdministrador />
            <Container className="mt-4">
                <h2>Tipos de Incidente</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Button variant="primary" className="mb-3" onClick={handleAgregarTipo}>Agregar Tipo de Incidente</Button>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Tipo Incidente</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tipos.map((tipo) => (
                            <tr key={tipo.id_tipo_incidente}>
                                <td>{tipo.id_tipo_incidente}</td>
                                <td>{tipo.nombre_tipo_incidente}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditar(tipo.id_tipo_incidente)}>Editar</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleEliminar(tipo.id_tipo_incidente)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
};

export default ListaTipoIncidente;
