import { useState, useEffect } from 'react';
import incidenteService from '../../../services/incidente.service';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import HeaderAdministrador from '../../../components/administrador/HeaderAdministrador';

const ListaIncidente = () => {
    const [incidentes, setIncidentes] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIncidentes = async () => {
            try {
                const data = await incidenteService.listarIncidentes();
                setIncidentes(data);
            } catch (error) {
                console.error(error);
                setError('Error al listar los incidentes.');
            }
        };
        fetchIncidentes();
    }, []);

    const handleEditar = (id) => {
        navigate(`/panel-administracion/incidentes/editar/${id}`);
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este incidente?')) {
            try {
                await incidenteService.eliminarIncidente(id);
                setIncidentes((prev) => prev.filter((inc) => inc.id_incidente !== id));
            } catch (error) {
                console.error(error);
                setError('Error al eliminar el incidente.');
            }
        }
    };

    const handleAgregarFotos = (id) => {
        navigate(`/panel-administracion/incidentes/${id}/fotos`);
    };

    return (
        <>
            <HeaderAdministrador />
            <Container className="mt-4">
                <h2>Lista de Incidentes</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ID Carretera</th>
                            <th>ID Tipo Incidente</th>
                            <th>Latitud</th>
                            <th>Longitud</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidentes.map((inc) => (
                            <tr key={inc.id_incidente}>
                                <td>{inc.id_incidente}</td>
                                <td>{inc.id_carretera}</td>
                                <td>{inc.id_tipo_incidente}</td>
                                <td>{inc.latitud}</td>
                                <td>{inc.longitud}</td>
                                <td>{inc.descripcion || 'N/A'}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditar(inc.id_incidente)}>Editar</Button>
                                    <Button variant="danger" size="sm" className="me-2" onClick={() => handleEliminar(inc.id_incidente)}>Eliminar</Button>
                                    <Button variant="info" size="sm" onClick={() => handleAgregarFotos(inc.id_incidente)}>Agregar Fotos</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
};

export default ListaIncidente;
