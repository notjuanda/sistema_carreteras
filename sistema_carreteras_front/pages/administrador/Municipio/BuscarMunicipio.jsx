import { useState } from 'react';
import HeaderAdministrador from '../../../components/HeaderAdministrador';
import municipioService from '../../../services/municipio.service';
import { Table, Button, Container, Form, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BuscarMunicipio = () => {
    const [municipios, setMunicipios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleBuscar = async (e) => {
        e.preventDefault();
        if (!searchTerm) {
            alert('Por favor, ingresa un nombre para buscar.');
            return;
        }
        try {
            const data = await municipioService.buscarMunicipio(searchTerm);
            setMunicipios(data);
            setError('');
        } catch (error) {
            console.error(error);
            setError('Error al buscar el municipio.');
        }
    };

    const handleEditar = (id) => {
        navigate(`/panel-administracion/municipios/editar/${id}`);
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este municipio?')) {
            try {
                await municipioService.eliminarMunicipio(id);
                setMunicipios(municipios.filter((municipio) => municipio.id_municipio !== id));
            } catch (error) {
                console.error(error);
                setError('Error al eliminar el municipio.');
            }
        }
    };

    const handleAgregar = () => {
        navigate('/panel-administracion/municipios/agregar');
    };

    return (
        <>
            <HeaderAdministrador />
            <Container className="mt-4">
                <Row className="mb-3">
                    <Col md={8}>
                        <Form onSubmit={handleBuscar}>
                            <Form.Control
                                type="text"
                                placeholder="Buscar Municipio por Nombre"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </Form>
                    </Col>
                    <Col md={4} className="text-end">
                        <Button variant="primary" onClick={handleAgregar}>
                            Agregar Municipio
                        </Button>
                    </Col>
                </Row>
                {error && <Alert variant="danger">{error}</Alert>}
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Latitud</th>
                            <th>Longitud</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {municipios.map((municipio) => (
                            <tr key={municipio.id_municipio}>
                                <td>{municipio.nombre}</td>
                                <td>{municipio.latitud}</td>
                                <td>{municipio.longitud}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        className="me-2"
                                        onClick={() => handleEditar(municipio.id_municipio)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleEliminar(municipio.id_municipio)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
};

export default BuscarMunicipio;
