/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import HeaderAdministrador from '../../../components/administrador/HeaderAdministrador';
import carreteraService from '../../../services/carretera.service';
import incidenteService from '../../../services/incidente.service';
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

const IncidenteMapa = () => {
    const [carreteras, setCarreteras] = useState([]);
    const [incidentes, setIncidentes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [selectedCarretera, setSelectedCarretera] = useState(null);
    const [clickPosition, setClickPosition] = useState(null);
    const [clickedCarreteraId, setClickedCarreteraId] = useState(null);

    const navigate = useNavigate();
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const carreterasData = await carreteraService.obtenerCarreteras();
                setCarreteras(carreterasData);
            } catch (error) {
                setError('Error al obtener la lista de carreteras.');
            }

            try {
                const incidentesData = await incidenteService.listarIncidentes();
                setIncidentes(incidentesData);
            } catch (error) {
                console.error(error);
                setError('Error al listar los incidentes.');
            }
        };
        fetchData();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCarreteras = carreteras.filter((carretera) =>
        carretera.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEliminarIncidente = async (id) => {
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

    const handleEditarIncidente = (id) => {
        navigate(`/panel-administracion/incidentes/editar/${id}`);
    };

    const handleAgregarFotos = (id) => {
        navigate(`/panel-administracion/incidentes/${id}/fotos`);
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
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </div>

                <h3>Lista de Incidentes</h3>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Carretera</th>
                            <th>Tipo Incidente</th>
                            <th>Lat</th>
                            <th>Lng</th>
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
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditarIncidente(inc.id_incidente)}>Editar</Button>
                                    <Button variant="danger" size="sm" className="me-2" onClick={() => handleEliminarIncidente(inc.id_incidente)}>Eliminar</Button>
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

export default IncidenteMapa;
