import { useState, useEffect } from 'react';
import { Button, Table, Alert } from 'react-bootstrap';
import UsuarioService from '../../../services/usuario.service';
import HeaderAdministrador from '../../../components/administrador/HeaderAdministrador';
import CrearUsuarioModal from './CrearUsuarioModal';
import CambioContraseñaModal from './CambioContraseñaModal';

const ListaUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editUsuarioId, setEditUsuarioId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const data = await UsuarioService.getAllUsers();
                setUsuarios(data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, []);

    const handleEditUsuario = (usuario) => {
        setEditMode(true);
        setEditUsuarioId(usuario.id_usuario);
        setShowModal(true);
    };

    const handleDeleteUsuario = async (id) => {
        try {
            await UsuarioService.deleteUser(id);
            setUsuarios(usuarios.filter(usuario => usuario.id_usuario !== id));
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    };

    const handleChangePassword = (id) => {
        setEditUsuarioId(id);
        setShowPasswordModal(true);
    };

    return (
        <>
            <HeaderAdministrador />
            <div className="d-flex justify-content-between mb-3">
                <h2>Lista de Usuarios</h2>
                <Button variant="primary" onClick={() => { setEditMode(false); setShowModal(true); }}>
                    Agregar Usuario
                </Button>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center mt-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : usuarios.length === 0 ? (
                <Alert variant="info" className="mt-3">
                    No hay usuarios registrados. ¡Agrega un nuevo usuario!
                </Alert>
            ) : (
                <Table striped bordered hover responsive className="mt-3">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Tipo de Usuario</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.id_usuario}>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.tipo_usuario}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleEditUsuario(usuario)} className="me-2">
                                        Editar
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDeleteUsuario(usuario.id_usuario)} className="me-2">
                                        Eliminar
                                    </Button>
                                    <Button variant="info" onClick={() => handleChangePassword(usuario.id_usuario)}>
                                        Cambiar Contraseña
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <CrearUsuarioModal
                show={showModal}
                setShow={setShowModal}
                editMode={editMode}
                setEditMode={setEditMode}
                editUsuarioId={editUsuarioId}
                setUsuarios={setUsuarios}
                usuarios={usuarios}
                fetchUsuarios={() => {
                    setLoading(true);
                    UsuarioService.getAllUsers()
                        .then((data) => setUsuarios(data))
                        .catch((err) => console.error('Error al obtener usuarios:', err))
                        .finally(() => setLoading(false));
                }}
            />

            <CambioContraseñaModal
                show={showPasswordModal}
                setShow={setShowPasswordModal}
                usuarioId={editUsuarioId}
                fetchUsuarios={() => {
                    setLoading(true);
                    UsuarioService.getAllUsers()
                        .then((data) => setUsuarios(data))
                        .catch((err) => console.error('Error al obtener usuarios:', err))
                        .finally(() => setLoading(false));
                }}
            />
        </>
    );
};

export default ListaUsuario;
