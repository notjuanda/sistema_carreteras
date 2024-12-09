/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import HeaderAdministrador from '../../../components/administrador/HeaderAdministrador';
import carreteraService from '../../../services/carretera.service';
import FiltroCarretera from './FiltroCarretera';
import { Table, Button, Container, Form, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';

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

const ListaCarretera = () => {
    const [carreteras, setCarreteras] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [selectedCarretera, setSelectedCarretera] = useState(null);
    const [filterMunicipio, setFilterMunicipio] = useState('');
    const [clickPosition, setClickPosition] = useState(null);
    const [clickedCarreteraId, setClickedCarreteraId] = useState(null);

    const navigate = useNavigate();
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchCarreteras = async () => {
            try {
                let data;
                if (filterMunicipio) {
                    data = await carreteraService.obtenerCarreterasPorMunicipio(filterMunicipio);
                } else {
                    data = await carreteraService.obtenerCarreteras();
                }
                setCarreteras(data);
            } catch (error) {
                setError('Error al obtener la lista de carreteras.');
            }
        };
        fetchCarreteras();
    }, [filterMunicipio]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCarreteras = carreteras.filter((carretera) =>
        carretera.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditar = (id) => {
        navigate(`/panel-administracion/carreteras/editar/${id}`);
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta carretera?')) {
            try {
                await carreteraService.eliminarCarretera(id);
                setCarreteras((prevCarreteras) =>
                    prevCarreteras.filter((carretera) => carretera.id_carretera !== id)
                );
                if (selectedCarretera?.id_carretera === id) {
                    setSelectedCarretera(null);
                }
            } catch (error) {
                setError('Error al eliminar la carretera.');
            }
        }
    };

    const handleAgregarRuta = (id) => {
        navigate(`/panel-administracion/carreteras/${id}/rutas`);
    };

    const handleAgregarCarretera = () => {
        navigate('/panel-administracion/carreteras/agregar');
    };

    const handleFilter = (municipio_id) => {
        setFilterMunicipio(municipio_id);
    };

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
        ajustarMapa(map, filteredCarreteras);
    }, [filteredCarreteras]);

    useEffect(() => {
        if (mapRef.current) {
            ajustarMapa(mapRef.current, filteredCarreteras);
        }
    }, [filteredCarreteras]);

    const ajustarMapa = (map, carreterasParaAjustar) => {
        if (carreterasParaAjustar.length === 0) {
            map.setCenter(defaultCenter);
            map.setZoom(7);
            return;
        }

        const bounds = new window.google.maps.LatLngBounds();
        carreterasParaAjustar.forEach((carretera) => {
            if (
                carretera.municipioOrigen &&
                carretera.municipioOrigen.latitud &&
                carretera.municipioOrigen.longitud
            ) {
                bounds.extend({
                    lat: parseFloat(carretera.municipioOrigen.latitud),
                    lng: parseFloat(carretera.municipioOrigen.longitud),
                });
            }
            if (
                carretera.municipioDestino &&
                carretera.municipioDestino.latitud &&
                carretera.municipioDestino.longitud
            ) {
                bounds.extend({
                    lat: parseFloat(carretera.municipioDestino.latitud),
                    lng: parseFloat(carretera.municipioDestino.longitud),
                });
            }
            if (carretera.puntos && carretera.puntos.length > 0) {
                carretera.puntos.forEach((punto) => {
                    if (punto.latitud && punto.longitud) {
                        bounds.extend({
                            lat: parseFloat(punto.latitud),
                            lng: parseFloat(punto.longitud),
                        });
                    }
                });
            }
        });
        map.fitBounds(bounds);
    };

    const handlePolylineClick = (carretera, e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setClickPosition({ lat, lng });
        setClickedCarreteraId(carretera.id_carretera);
    };

    const handleAgregarIncidenteClick = () => {
        if (clickPosition && clickedCarreteraId) {
            navigate(`/panel-administracion/incidentes/agregar`, { state: { 
                lat: clickPosition.lat, 
                lng: clickPosition.lng, 
                id_carretera: clickedCarreteraId
            }});
        }
    };

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
                            placeholder="Buscar Carretera"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Col>
                    <Col md={6} className="text-end">
                        <Button variant="primary" onClick={handleAgregarCarretera}>
                            Agregar Carretera
                        </Button>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <FiltroCarretera onFilter={handleFilter} />
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
                        {filteredCarreteras.map((carretera) => {
                            const origen =
                                carretera.municipioOrigen &&
                                carretera.municipioOrigen.latitud &&
                                carretera.municipioOrigen.longitud
                                    ? {
                                          lat: parseFloat(carretera.municipioOrigen.latitud),
                                          lng: parseFloat(carretera.municipioOrigen.longitud),
                                      }
                                    : null;

                            const destino =
                                carretera.municipioDestino &&
                                carretera.municipioDestino.latitud &&
                                carretera.municipioDestino.longitud
                                    ? {
                                          lat: parseFloat(carretera.municipioDestino.latitud),
                                          lng: parseFloat(carretera.municipioDestino.longitud),
                                      }
                                    : null;

                            const puntosRuta =
                                carretera.puntos && carretera.puntos.length > 0
                                    ? carretera.puntos
                                          .sort((a, b) => a.id_punto - b.id_punto)
                                          .map((punto) => ({
                                              lat: parseFloat(punto.latitud),
                                              lng: parseFloat(punto.longitud),
                                          }))
                                    : [];

                            const rutaCompleta = [];
                            if (origen) rutaCompleta.push(origen);
                            if (puntosRuta.length > 0) {
                                rutaCompleta.push(...puntosRuta);
                            }
                            if (destino) rutaCompleta.push(destino);

                            return (
                                <React.Fragment key={carretera.id_carretera}>
                                    {origen && (
                                        <Marker
                                            position={origen}
                                            title={`Origen: ${carretera.municipioOrigen.nombre}`}
                                            icon={{
                                                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                                                scaledSize: new window.google.maps.Size(32, 32),
                                            }}
                                            onClick={() =>
                                                setSelectedCarretera({
                                                    ...carretera,
                                                    position: origen,
                                                    tipo: 'origen',
                                                })
                                            }
                                        />
                                    )}
                                    {destino && (
                                        <Marker
                                            position={destino}
                                            title={`Destino: ${carretera.municipioDestino.nombre}`}
                                            icon={{
                                                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                                                scaledSize: new window.google.maps.Size(32, 32),
                                            }}
                                            onClick={() =>
                                                setSelectedCarretera({
                                                    ...carretera,
                                                    position: destino,
                                                    tipo: 'destino',
                                                })
                                            }
                                        />
                                    )}
                                    {rutaCompleta.length > 1 && (
                                        <Polyline
                                            path={rutaCompleta}
                                            options={{ strokeColor: '#FF0000', strokeWeight: 2 }}
                                            onClick={(e) => handlePolylineClick(carretera, e)}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}

                        {clickPosition && (
                            <InfoWindow
                                position={clickPosition}
                                onCloseClick={() => {
                                    setClickPosition(null);
                                    setClickedCarreteraId(null);
                                }}
                            >
                                <div>
                                    <Button variant="success" onClick={handleAgregarIncidenteClick}>
                                        Agregar Incidente
                                    </Button>
                                </div>
                            </InfoWindow>
                        )}

                        {selectedCarretera && selectedCarretera.position && (
                            <InfoWindow
                                position={selectedCarretera.position}
                                onCloseClick={() => setSelectedCarretera(null)}
                            >
                                <div>
                                    <h5>{selectedCarretera.nombre}</h5>
                                    <p>
                                        <strong>Municipio Origen:</strong>{' '}
                                        {selectedCarretera.municipioOrigen?.nombre || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Municipio Destino:</strong>{' '}
                                        {selectedCarretera.municipioDestino?.nombre || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Estado:</strong> {selectedCarretera.estado}
                                    </p>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEditar(selectedCarretera.id_carretera)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleEliminar(selectedCarretera.id_carretera)}
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => handleAgregarRuta(selectedCarretera.id_carretera)}
                                    >
                                        Agregar/Edit Ruta
                                    </Button>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </div>

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Municipio Origen</th>
                            <th>Municipio Destino</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCarreteras.map((carretera) => (
                            <tr key={carretera.id_carretera}>
                                <td>{carretera.nombre}</td>
                                <td>{carretera.municipioOrigen?.nombre || 'N/A'}</td>
                                <td>{carretera.municipioDestino?.nombre || 'N/A'}</td>
                                <td>{carretera.estado}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        onClick={() => handleEditar(carretera.id_carretera)}
                                        className="me-2"
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleEliminar(carretera.id_carretera)}
                                        className="me-2"
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
                                        variant="info"
                                        onClick={() => handleAgregarRuta(carretera.id_carretera)}
                                    >
                                        Agregar/Edit Ruta
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

export default ListaCarretera;
