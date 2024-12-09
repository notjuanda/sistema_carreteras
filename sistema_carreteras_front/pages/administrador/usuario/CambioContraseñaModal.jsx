/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import UsuarioService from '../../../services/usuario.service';

const CambioContraseñaModal = ({ show, setShow, usuarioId, fetchUsuarios }) => {
    const [nuevaContraseña, setNuevaContraseña] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setShow(false);
        setError(null);
        setNuevaContraseña('');
    };

    const handleChangePassword = async () => {
        if (!nuevaContraseña) {
            setError('La contraseña es obligatoria');
            return;
        }

        setLoading(true);
        try {
            await UsuarioService.changePassword(usuarioId, nuevaContraseña);
            fetchUsuarios();
            handleClose();
        } catch (error) {
            setError('Error al cambiar la contraseña');
            console.error('Error al cambiar la contraseña:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Cambiar Contraseña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p className="text-danger">{error}</p>}
                <Form>
                    <Form.Group className="mb-3" controlId="formNuevaContraseña">
                        <Form.Label>Nueva Contraseña</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Ingresa la nueva contraseña"
                            value={nuevaContraseña}
                            onChange={(e) => setNuevaContraseña(e.target.value)} 
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleChangePassword} 
                    disabled={loading}
                >
                    {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CambioContraseñaModal;
