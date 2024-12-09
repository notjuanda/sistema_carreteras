import { useState, useEffect } from 'react';
import fotoIncidenteService from '../../../services/foto_incidente.service';
import { Form, Button, Container, Alert, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import HeaderAdministrador from '../../../components/administrador/HeaderAdministrador';

const AgregarFotoIncidente = () => {
    const { id } = useParams();
    const [fotos, setFotos] = useState([]);
    const [error, setError] = useState('');
    const [imagen, setImagen] = useState(null);

    useEffect(() => {
        const fetchFotos = async () => {
            try {
                const data = await fotoIncidenteService.obtenerFotosDeIncidente(id);
                setFotos(data);
            } catch (error) {
                console.error(error);
                setError('Error al obtener las fotos del incidente.');
            }
        };
        fetchFotos();
    }, [id]);

    const handleImagenChange = (e) => {
        setImagen(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imagen) {
            setError('Debes seleccionar una imagen.');
            return;
        }

        const formData = new FormData();
        formData.append('id_incidente', id);
        formData.append('imagen', imagen);

        try {
            await fotoIncidenteService.crearFotoIncidente(formData);
            const data = await fotoIncidenteService.obtenerFotosDeIncidente(id);
            setFotos(data);
            setImagen(null);
            e.target.reset();
        } catch (error) {
            console.error(error);
            setError('Error al agregar la foto.');
        }
    };

    const handleEliminarFoto = async (fotoId) => {
        if (window.confirm('¿Estás seguro de eliminar esta foto?')) {
            try {
                await fotoIncidenteService.eliminarFotoIncidente(fotoId);
                setFotos((prev) => prev.filter((f) => f.id_foto !== fotoId));
            } catch (error) {
                console.error(error);
                setError('Error al eliminar la foto.');
            }
        }
    };

    return (
        <>
            <HeaderAdministrador />
            <Container className="mt-4">
                <h2>Agregar Fotos al Incidente {id}</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit} className="mb-4">
                    <Form.Group className="mb-3">
                        <Form.Label>Seleccionar Imagen</Form.Label>
                        <Form.Control type="file" onChange={handleImagenChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Agregar Foto</Button>
                </Form>
                {fotos.length > 0 ? (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID Foto</th>
                                <th>URL Foto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fotos.map((foto) => (
                                <tr key={foto.id_foto}>
                                    <td>{foto.id_foto}</td>
                                    <td>
                                        <img src={`http://localhost:3000${foto.url_foto}`} alt="Foto Incidente" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                    </td>
                                    <td>
                                        <Button variant="danger" size="sm" onClick={() => handleEliminarFoto(foto.id_foto)}>Eliminar</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p>No hay fotos para este incidente. Agrega una nueva foto arriba.</p>
                )}
            </Container>
        </>
    );
};

export default AgregarFotoIncidente;
