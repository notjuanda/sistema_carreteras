/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import UsuarioService from '../../../services/usuario.service';

const CrearUsuarioModal = ({ show, setShow, editMode, setEditMode, editUsuarioId, setUsuarios, usuarios, fetchUsuarios }) => {
    const [usuarioData, setUsuarioData] = useState({
        nombre: '',
        email: '',
        tipo_usuario: 'verificador',
        contraseña: ''  // La contraseña solo debe ser enviada al crear un usuario
    });

    useEffect(() => {
        if (editMode && editUsuarioId) {
            const fetchUsuario = async () => {
                try {
                    const usuario = await UsuarioService.getUserById(editUsuarioId);
                    setUsuarioData({
                        nombre: usuario.nombre,
                        email: usuario.email,
                        tipo_usuario: usuario.tipo_usuario,
                        // No establecemos la contraseña para no sobrescribirla
                    });
                } catch (error) {
                    console.error('Error al obtener el usuario:', error);
                }
            };

            fetchUsuario();
        }
    }, [editMode, editUsuarioId]);

    const handleAddUsuario = async () => {
        if (editMode) {
            try {
                const { contraseña, ...userDataToUpdate } = usuarioData;
                await UsuarioService.updateUser(editUsuarioId, userDataToUpdate);
                setUsuarios(usuarios.map(usuario => 
                    usuario.id_usuario === editUsuarioId ? { ...usuario, ...usuarioData } : usuario
                ));
                setEditMode(false);
                fetchUsuarios();
            } catch (error) {
                console.error('Error al actualizar usuario:', error);
            }
        } else {
            try {
                await UsuarioService.createUser(usuarioData);
                fetchUsuarios();
            } catch (error) {
                console.error('Error al agregar usuario:', error);
            }
        }
        setShow(false);
        setUsuarioData({
            nombre: '',
            email: '',
            tipo_usuario: 'verificador',
            contraseña: ''  // Resetear la contraseña después de cerrar el modal
        });
    };

    const handleClose = () => {
        setShow(false);
        setUsuarioData({
            nombre: '',
            email: '',
            tipo_usuario: 'verificador',
            contraseña: ''
        });
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{editMode ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Nombre del usuario"
                            value={usuarioData.nombre} 
                            onChange={(e) => setUsuarioData({ ...usuarioData, nombre: e.target.value })} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Email del usuario"
                            value={usuarioData.email} 
                            onChange={(e) => setUsuarioData({ ...usuarioData, email: e.target.value })} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formTipoUsuario">
                        <Form.Label>Tipo de Usuario</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={usuarioData.tipo_usuario} 
                            onChange={(e) => setUsuarioData({ ...usuarioData, tipo_usuario: e.target.value })}>
                            <option value="verificador">Verificador</option>
                            <option value="administrador">Administrador</option>
                        </Form.Control>
                    </Form.Group>
                    {/* Mostrar contraseña solo en modo de creación */}
                    {!editMode && (
                        <Form.Group className="mb-3" controlId="formContraseña">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Contraseña" 
                                value={usuarioData.contraseña}
                                onChange={(e) => setUsuarioData({ ...usuarioData, contraseña: e.target.value })} 
                            />
                        </Form.Group>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={handleAddUsuario}>
                    {editMode ? 'Guardar cambios' : 'Agregar usuario'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CrearUsuarioModal;
