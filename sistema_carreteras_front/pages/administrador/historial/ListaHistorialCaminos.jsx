import { useState, useEffect } from 'react';
import { Table, Alert, Spinner } from 'react-bootstrap';
import historialService from '../../../services/historial.service';
import HeaderAdministrador from '../../../components/administrador/HeaderAdministrador';

const ListaHistorialCaminos = () => {
    const [historialCaminos, setHistorialCaminos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistorialCaminos = async () => {
            try {
                const data = await historialService.obtenerHistorialCambios();
                setHistorialCaminos(data.historial || []);
            } catch (err) {
                setError('Error al obtener historial de caminos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistorialCaminos();
    }, []);

    const renderTableData = () => {
        if (historialCaminos.length === 0) {
            return (
                <tr>
                    <td colSpan="5">No hay registros de historial de caminos.</td>
                </tr>
            );
        }

        return historialCaminos.map((item) => (
            <tr key={item.id_historial}>
                <td>{item.nombre_usuario}</td>
                <td>{item.accion}</td>
                <td>{new Date(item.fecha).toLocaleString()}</td>
                <td>{item.entidad_afectada}</td>
                <td>{item.id_entidad}</td>
            </tr>
        ));
    };

    return (
        <>
            <HeaderAdministrador />
            <h2>Historial de Caminos</h2>
            {loading && (
                <div className="d-flex justify-content-center mt-4">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}
            {error && <Alert variant="danger">{error}</Alert>}
            <Table striped bordered hover responsive className="mt-3">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Acción</th>
                        <th>Fecha</th>
                        <th>Entidad Afectada</th>
                        <th>ID Entidad</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableData()}
                </tbody>
            </Table>
        </>
    );
};

export default ListaHistorialCaminos;
