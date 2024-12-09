import { useState, useEffect } from 'react';
import HeaderAdministrador from '../../../components/administrador/HeaderAdministrador';
import carreteraService from '../../../services/carretera.service';
import municipioService from '../../../services/municipio.service';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const AgregarCarretera = () => {
    const [nombre, setNombre] = useState('');
    const [idMunicipioOrigen, setIdMunicipioOrigen] = useState('');
    const [idMunicipioDestino, setIdMunicipioDestino] = useState('');
    const [estado, setEstado] = useState('libre');
    const [descripcion, setDescripcion] = useState('');
    const [municipios, setMunicipios] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditar = Boolean(id);

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

    useEffect(() => {
        if (isEditar) {
            const fetchCarretera = async () => {
                try {
                    const carretera = await carreteraService.obtenerCarreteraPorId(id);
                    setNombre(carretera.nombre);
                    setIdMunicipioOrigen(carretera.id_municipio_origen);
                    setIdMunicipioDestino(carretera.id_municipio_destino);
                    setEstado(carretera.estado);
                    setDescripcion(carretera.descripcion || '');
                } catch (error) {
                    console.error(error);
                    setError('Error al obtener los datos de la carretera.');
                }
            };
            fetchCarretera();
        }
    }, [id, isEditar]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre || !idMunicipioOrigen || !idMunicipioDestino || !estado) {
            alert('Todos los campos requeridos deben ser completados.');
            return;
        }
        const carreteraData = {
            nombre,
            id_municipio_origen: parseInt(idMunicipioOrigen),
            id_municipio_destino: parseInt(idMunicipioDestino),
            estado,
            descripcion,
        };
        try {
            if (isEditar) {
                await carreteraService.actualizarCarretera(id, carreteraData);
                alert('Carretera actualizada con éxito.');
                navigate('/panel-administracion/carreteras');
            } else {
                const nuevaCarretera = await carreteraService.crearCarretera(carreteraData);
                alert('Carretera creada con éxito. Ahora puedes agregar rutas.');
                navigate(`/panel-administracion/carreteras/${nuevaCarretera.carretera.id_carretera}/rutas`);
            }
        } catch (error) {
            console.error(error);
            setError('Error al guardar la carretera.');
        }
    };

    return (
        <>
            <HeaderAdministrador />
            <Container className="mt-4">
                <h2>{isEditar ? 'Editar Carretera' : 'Agregar Nueva Carretera'}</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit} className="mt-3">
                    <Form.Group controlId="nombre" className="mb-3">
                        <Form.Label>Nombre de la Carretera</Form.Label>
                        <Form.Control
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="municipioOrigen" className="mb-3">
                        <Form.Label>Municipio de Origen</Form.Label>
                        <Form.Control
                            as="select"
                            value={idMunicipioOrigen}
                            onChange={(e) => setIdMunicipioOrigen(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un municipio</option>
                            {municipios.map((municipio) => (
                                <option key={municipio.id_municipio} value={municipio.id_municipio}>
                                    {municipio.nombre}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="municipioDestino" className="mb-3">
                        <Form.Label>Municipio de Destino</Form.Label>
                        <Form.Control
                            as="select"
                            value={idMunicipioDestino}
                            onChange={(e) => setIdMunicipioDestino(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un municipio</option>
                            {municipios.map((municipio) => (
                                <option key={municipio.id_municipio} value={municipio.id_municipio}>
                                    {municipio.nombre}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="estado" className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Control
                            as="select"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            required
                        >
                            <option value="libre">Libre</option>
                            <option value="bloqueada">Bloqueada</option>
                        </Form.Control>
                    </Form.Group>
                    {estado === 'bloqueada' && (
                        <Form.Group controlId="descripcion" className="mb-3">
                            <Form.Label>Razón de Bloqueo</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                        </Form.Group>
                    )}
                    <Button variant="primary" type="submit">
                        {isEditar ? 'Actualizar Carretera' : 'Crear Carretera'}
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default AgregarCarretera;
