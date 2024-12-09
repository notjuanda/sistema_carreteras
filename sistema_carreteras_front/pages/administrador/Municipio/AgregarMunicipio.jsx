import { useState, useEffect } from 'react';
import HeaderAdministrador from '../../../components/administrador/HeaderAdministrador';
import municipioService from '../../../services/municipio.service';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import MapSelector from './MapSelector';

const AgregarMunicipio = () => {
    const [nombre, setNombre] = useState('');
    const [latitud, setLatitud] = useState('');
    const [longitud, setLongitud] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditar = Boolean(id);

    useEffect(() => {
        if (isEditar) {
            const fetchMunicipio = async () => {
                try {
                    const data = await municipioService.obtenerMunicipioPorId(id);
                    setNombre(data.nombre);
                    setLatitud(data.latitud);
                    setLongitud(data.longitud);
                } catch (error) {
                    console.error(error);
                    setError('Error al obtener los datos del municipio.');
                }
            };
            fetchMunicipio();
        }
    }, [id, isEditar]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre || !latitud || !longitud) {
            alert('Todos los campos requeridos deben ser completados.');
            return;
        }
        const municipioData = {
            nombre,
            latitud: parseFloat(latitud),
            longitud: parseFloat(longitud),
        };
        try {
            if (isEditar) {
                await municipioService.editarMunicipio(id, municipioData);
                alert('Municipio actualizado con éxito.');
            } else {
                await municipioService.crearMunicipio(municipioData);
                alert('Municipio creado con éxito.');
            }
            navigate('/panel-administracion/municipios');
        } catch (error) {
            console.error(error);
            setError('Error al guardar el municipio.');
        }
    };

    const handleSelectLocation = ({ lat, lng }) => {
        setLatitud(lat.toFixed(8));
        setLongitud(lng.toFixed(8));
    };

    return (
        <>
            <HeaderAdministrador />
            <Container className="mt-4">
                <h2>{isEditar ? 'Editar Municipio' : 'Agregar Nuevo Municipio'}</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit} className="mt-3">
                    <Form.Group controlId="nombre" className="mb-3">
                        <Form.Label>Nombre del Municipio</Form.Label>
                        <Form.Control
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Selecciona la Ubicación en el Mapa</Form.Label>
                        <MapSelector
                            initialLat={latitud}
                            initialLng={longitud}
                            onSelect={handleSelectLocation}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        {isEditar ? 'Actualizar Municipio' : 'Crear Municipio'}
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default AgregarMunicipio;
