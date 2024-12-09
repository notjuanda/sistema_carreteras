// src/pages/administrador/municipio/ListaMunicipio.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import HeaderAdministrador from '../../../components/administrador/HeaderAdministrador';
import municipioService from '../../../services/municipio.service';
import { Table, Button, Container, Form, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '400px',
};
const defaultCenter = {
    lat: -16.2902,
    lng: -63.5887,
};
const options = {
    disableDefaultUI: false,
    zoomControl: true,
};

const ListaMunicipio = () => {
    const [municipios, setMunicipios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMunicipios = async () => {
            try {
                const data = await municipioService.listarMunicipios();
                setMunicipios(data);
            } catch (error) {
                console.error(error);
                setError('Error al obtener la lista de municipios.');
            }
        };
        fetchMunicipios();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredMunicipios = municipios.filter((municipio) =>
        municipio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    if (loadError) return <div>Error al cargar el mapa</div>;
    if (!isLoaded) return <div>Cargando mapa...</div>;

    return (
        <>
            <HeaderAdministrador />
            <Container className="mt-4">
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Control
                            type="text"
                            placeholder="Buscar Municipio"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Col>
                    <Col md={6} className="text-end">
                        <Button variant="primary" onClick={handleAgregar}>
                            Agregar Municipio
                        </Button>
                    </Col>
                </Row>
                {error && <Alert variant="danger">{error}</Alert>}
                <div className="mb-4">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={7}
                        center={defaultCenter}
                        options={options}
                        onLoad={onMapLoad}
                    >
                        {filteredMunicipios.map((municipio) => (
                            <Marker
                                key={municipio.id_municipio}
                                position={{ lat: parseFloat(municipio.latitud), lng: parseFloat(municipio.longitud) }}
                                title={municipio.nombre}
                            />
                        ))}
                    </GoogleMap>
                </div>
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
                        {filteredMunicipios.map((municipio) => (
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

export default ListaMunicipio;
