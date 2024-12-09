import { useEffect, useState } from 'react';
import HeaderAdministrador from '../../../components/administrador/HeaderAdministrador';
import MapComponent from '../../../components/MapComponent';
import puntoService from '../../../services/punto.service';
import carreteraService from '../../../services/carretera.service';
import { Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const CrearRutas = () => {
    const [points, setPoints] = useState([]);
    const [carretera, setCarretera] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchCarretera = async () => {
            try {
                const data = await carreteraService.obtenerCarreteraPorId(id);
                setCarretera(data);
            } catch (err) {
                console.error(err);
                setError('Error al obtener la carretera.');
            }
        };
        fetchCarretera();
    }, [id]);

    useEffect(() => {
        const fetchPuntos = async () => {
            try {
                const data = await puntoService.listarPuntosPorCarretera(id);
                const sortedData = data.sort((a, b) => a.id_punto - b.id_punto);
                setPoints(sortedData.map(punto => ({ id_punto: punto.id_punto, lat: parseFloat(punto.latitud), lng: parseFloat(punto.longitud) })));
            } catch (err) {
                console.error(err);
                setError('Error al obtener los puntos.');
            }
        };
        fetchPuntos();
    }, [id]);

    const handlePointsChange = (newPoints) => {
        setPoints(newPoints);
    };

    const handleGuardar = async () => {
        try {
            const existingPuntos = await puntoService.listarPuntosPorCarretera(id);
            for (const punto of existingPuntos) {
                await puntoService.eliminarPunto(punto.id_punto);
            }
            for (const punto of points) {
                await puntoService.crearPunto({
                    id_carretera: parseInt(id),
                    latitud: punto.lat,
                    longitud: punto.lng,
                });
            }
            alert('Rutas guardadas con éxito.');
            navigate('/panel-administracion/');
        } catch (err) {
            console.error(err);
            setError('Error al guardar las rutas.');
        }
    };

    const handleAgregarRuta = () => {
        setPoints([]);
        alert('Ruta actualizada. Puedes agregar una nueva ruta.');
    };

    return (
        <>
            <HeaderAdministrador />
            <Container className="mt-4">
                <h2>Crear/Editar Rutas para {carretera?.nombre}</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <MapComponent initialPoints={points} onPointsChange={handlePointsChange} />
                <div className="mt-3">
                    <Button variant="success" onClick={handleGuardar} disabled={points.length === 0} className="me-2">
                        Guardar Rutas
                    </Button>
                    <Button variant="secondary" onClick={handleAgregarRuta} disabled={points.length === 0}>
                        Agregar Nueva Ruta
                    </Button>
                </div>
                {points.length > 0 && (
                    <div className="mt-3">
                        <h5>Puntos Agregados:</h5>
                        <ul>
                            {points.map((punto, index) => (
                                <li key={index}>Lat: {punto.lat}, Lng: {punto.lng}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </Container>
        </>
    );
};

export default CrearRutas;
