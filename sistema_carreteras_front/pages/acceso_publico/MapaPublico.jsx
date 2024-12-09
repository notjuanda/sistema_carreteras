import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Row, Col, Form, Button, Alert, Modal, Table } from 'react-bootstrap';
import { GoogleMap, useLoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';

import carreteraService from '../../services/carretera.service';
import municipioService from '../../services/municipio.service';
import incidenteService from '../../services/incidente.service';
import solicitudIncidenteService from '../../services/solicitud_incidente.service';
import tipoIncidenteService from '../../services/tipo_incidente.service';

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

const MapaPublico = () => {
    const [carreteras, setCarreteras] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [incidentes, setIncidentes] = useState([]);
    const [tiposIncidente, setTiposIncidente] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterTipo, setFilterTipo] = useState('');
    const [error, setError] = useState('');

    const [highlightedCarretera, setHighlightedCarretera] = useState(null);

    // Modal motivo bloqueo
    const [showMotivoModal, setShowMotivoModal] = useState(false);
    const [motivoFotoUrl, setMotivoFotoUrl] = useState('');

    // Reportar incidente (solicitud)
    const [clickPosition, setClickPosition] = useState(null);
    const [clickedCarreteraId, setClickedCarreteraId] = useState(null);
    const [showReporteModal, setShowReporteModal] = useState(false);
    const [reporteDescripcion, setReporteDescripcion] = useState('');
    const [reporteImagen, setReporteImagen] = useState(null);

    // Ver incidente existente
    const [selectedIncidente, setSelectedIncidente] = useState(null);
    const [showIncidenteModal, setShowIncidenteModal] = useState(false);

    const mapRef = useRef(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataCarreteras = await carreteraService.obtenerCarreterasPublicas();
                setCarreteras(dataCarreteras);

                const dataMunicipios = await municipioService.listarMunicipios();
                setMunicipios(dataMunicipios);

                const dataIncidentes = await incidenteService.listarIncidentes();
                setIncidentes(dataIncidentes);

                const dataTipos = await tipoIncidenteService.getAllTiposIncidente();
                setTiposIncidente(dataTipos);
            } catch (err) {
                console.error(err);
                setError('Error al cargar datos.');
            }
        };
        fetchData();
    }, []);

    const filteredCarreteras = carreteras.filter((carretera) => {
        const matchesSearch = carretera.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            || carretera.municipioOrigen?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            || carretera.municipioDestino?.nombre.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (filterTipo) {
            if (carretera.estado === 'bloqueada') {
                const incidente = carretera.incidentes?.[0];
                const tipo = incidente?.tipoIncidente?.nombre_tipo_incidente || '';
                return tipo.toLowerCase().includes(filterTipo.toLowerCase());
            } else {
                return false;
            }
        }

        return true;
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
        if (carreterasParaAjustar.length === 0 && municipios.length === 0) {
            map.setCenter(defaultCenter);
            map.setZoom(7);
            return;
        }

        const bounds = new window.google.maps.LatLngBounds();

        municipios.forEach((mun) => {
            bounds.extend({
                lat: parseFloat(mun.latitud),
                lng: parseFloat(mun.longitud),
            });
        });

        carreterasParaAjustar.forEach((carretera) => {
            if (carretera.municipioOrigen?.latitud && carretera.municipioOrigen?.longitud) {
                bounds.extend({
                    lat: parseFloat(carretera.municipioOrigen.latitud),
                    lng: parseFloat(carretera.municipioOrigen.longitud),
                });
            }
            if (carretera.municipioDestino?.latitud && carretera.municipioDestino?.longitud) {
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

    const handleVerCarretera = (carretera) => {
        setHighlightedCarretera(carretera);
    };

    const handleVerMotivo = (carretera) => {
        const incidente = carretera.incidentes?.[0];
        if (!incidente || !incidente.fotos?.length) {
            setError('No se encontró el motivo del bloqueo.');
            return;
        }
        setMotivoFotoUrl(`http://localhost:3000${incidente.fotos[0].url_foto}`);
        setShowMotivoModal(true);
    };

    const handleCloseMotivoModal = () => {
        setShowMotivoModal(false);
        setMotivoFotoUrl('');
    };

    const handlePolylineClick = (carretera, e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setClickPosition({ lat, lng });
        setClickedCarreteraId(carretera.id_carretera);
    };

    const handleReportarIncidenteDesdePunto = () => {
        setShowReporteModal(true);
    };

    const handleCloseReporteModal = () => {
        setReporteDescripcion('');
        setReporteImagen(null);
        setShowReporteModal(false);
        setClickPosition(null);
        setClickedCarreteraId(null);
    };

    const handleCrearSolicitud = async (e) => {
        e.preventDefault();
        if (!reporteDescripcion.trim()) {
            setError('La descripción es obligatoria para reportar un incidente.');
            return;
        }
        try {
            const solicitudData = { descripcion: reporteDescripcion };
            await solicitudIncidenteService.createSolicitudIncidente(solicitudData, reporteImagen);
            handleCloseReporteModal();
            alert('Solicitud de incidente enviada con éxito.');
        } catch (error) {
            console.error(error);
            setError('Error al enviar la solicitud de incidente.');
        }
    };

    const handleImagenChange = (e) => {
        setReporteImagen(e.target.files[0]);
    };

    const handleIncidentMarkerClick = (incidente) => {
        setSelectedIncidente(incidente);
        setShowIncidenteModal(true);
    };

    const handleCloseIncidenteModal = () => {
        setShowIncidenteModal(false);
        setSelectedIncidente(null);
    };

    if (loadError) return <div>Error al cargar el mapa</div>;
    if (!isLoaded) return <div>Cargando mapa...</div>;

    return (
        <>
            <Container className="mt-4">
                <h2>Consulta de Rutas y Transitabilidad</h2>
                {error && <Alert variant="danger">{error}</Alert>}

                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            placeholder="Buscar carretera o municipio"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
                            <option value="">Todos</option>
                            {tiposIncidente.map((tipo) => (
                                <option key={tipo.id_tipo_incidente} value={tipo.nombre_tipo_incidente}>
                                    {tipo.nombre_tipo_incidente}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>

                <div className="mb-4">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={7}
                        center={defaultCenter}
                        options={options}
                        onLoad={onMapLoad}
                    >
                        {/* Municipios */}
                        {municipios.map((mun) => (
                            <Marker
                                key={mun.id_municipio}
                                position={{ lat: parseFloat(mun.latitud), lng: parseFloat(mun.longitud) }}
                                title={mun.nombre}
                                icon={{
                                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                                    scaledSize: new window.google.maps.Size(32, 32),
                                }}
                            />
                        ))}

                        {/* Incidentes existentes */}
                        {incidentes.map((inc) => (
                            <Marker
                                key={inc.id_incidente}
                                position={{ lat: parseFloat(inc.latitud), lng: parseFloat(inc.longitud) }}
                                title={`Incidente ID: ${inc.id_incidente}`}
                                icon={{
                                    url: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
                                    scaledSize: new window.google.maps.Size(32, 32),
                                }}
                                onClick={() => handleIncidentMarkerClick(inc)}
                            />
                        ))}

                        {/* Carreteras */}
                        {filteredCarreteras.map((carretera) => {
                            const origen = carretera.municipioOrigen?.latitud && carretera.municipioOrigen?.longitud
                                ? { lat: parseFloat(carretera.municipioOrigen.latitud), lng: parseFloat(carretera.municipioOrigen.longitud) }
                                : null;

                            const destino = carretera.municipioDestino?.latitud && carretera.municipioDestino?.longitud
                                ? { lat: parseFloat(carretera.municipioDestino.latitud), lng: parseFloat(carretera.municipioDestino.longitud) }
                                : null;

                            const puntosRuta = carretera.puntos && carretera.puntos.length > 0
                                ? carretera.puntos.sort((a, b) => a.id_punto - b.id_punto).map((punto) => ({
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

                            const highlighted = highlightedCarretera && highlightedCarretera.id_carretera === carretera.id_carretera;

                            return (
                                <React.Fragment key={carretera.id_carretera}>
                                    {rutaCompleta.length > 1 && (
                                        <Polyline
                                            path={rutaCompleta}
                                            options={{
                                                strokeColor: highlighted ? '#00FF00' : '#FF0000',
                                                strokeWeight: highlighted ? 4 : 2,
                                                strokeOpacity: highlighted ? 1 : 0.8,
                                            }}
                                            onClick={(e) => handlePolylineClick(carretera, e)}
                                        />
                                    )}
                                    {/* Si se quiere mostrar marcadores de origen/destino cuando está resaltada la carretera */}
                                    {highlighted && origen && (
                                        <Marker
                                            position={origen}
                                            title={`Origen: ${carretera.municipioOrigen.nombre}`}
                                            icon={{
                                                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                                                scaledSize: new window.google.maps.Size(32, 32),
                                            }}
                                        />
                                    )}
                                    {highlighted && destino && (
                                        <Marker
                                            position={destino}
                                            title={`Destino: ${carretera.municipioDestino.nombre}`}
                                            icon={{
                                                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                                                scaledSize: new window.google.maps.Size(32, 32),
                                            }}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}

                        {/* InfoWindow para reportar incidente en punto seleccionado */}
                        {clickPosition && clickedCarreteraId && (
                            <InfoWindow
                                position={clickPosition}
                                onCloseClick={() => {
                                    setClickPosition(null);
                                    setClickedCarreteraId(null);
                                }}
                            >
                                <div>
                                    <Button variant="success" onClick={handleReportarIncidenteDesdePunto}>
                                        Reportar Incidente
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
                                        variant="info"
                                        onClick={() => handleVerCarretera(carretera)}
                                        className="me-2"
                                    >
                                        Ver Carretera
                                    </Button>
                                    {carretera.estado === 'bloqueada' && (
                                        <Button
                                            variant="danger"
                                            onClick={() => handleVerMotivo(carretera)}
                                        >
                                            Ver Motivo
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            {/* Modal ver motivo */}
            <Modal show={showMotivoModal} onHide={handleCloseMotivoModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Motivo del Bloqueo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {motivoFotoUrl ? (
                        <img
                            src={motivoFotoUrl}
                            alt="Motivo Bloqueo"
                            style={{ maxWidth: '100%', maxHeight: '300px' }}
                        />
                    ) : (
                        'No se encontró la foto del motivo.'
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseMotivoModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal reportar incidente desde punto de polilínea */}
            <Modal show={showReporteModal} onHide={handleCloseReporteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Reportar Incidente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleCrearSolicitud}>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={reporteDescripcion}
                                onChange={(e) => setReporteDescripcion(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Foto (opcional)</Form.Label>
                            <Form.Control type="file" onChange={handleImagenChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Enviar Solicitud
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal ver incidente existente */}
            <Modal show={showIncidenteModal} onHide={handleCloseIncidenteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Incidente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedIncidente && (
                        <>
                            <p><strong>ID:</strong> {selectedIncidente.id_incidente}</p>
                            <p><strong>Carretera ID:</strong> {selectedIncidente.id_carretera}</p>
                            <p><strong>Tipo Incidente:</strong> {selectedIncidente.tipoIncidente?.nombre_tipo_incidente || 'N/A'}</p>
                            <p><strong>Descripción:</strong> {selectedIncidente.descripcion || 'N/A'}</p>
                            <p><strong>Lat:</strong> {selectedIncidente.latitud}, <strong>Lng:</strong> {selectedIncidente.longitud}</p>
                            {selectedIncidente.fotos?.length > 0 ? (
                                <div>
                                    <h5>Fotos:</h5>
                                    {selectedIncidente.fotos.map((foto) => (
                                        <img
                                            key={foto.id_foto}
                                            src={`http://localhost:3000${foto.url_foto}`}
                                            alt="Foto Incidente"
                                            style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p>Sin fotos</p>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseIncidenteModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MapaPublico;
