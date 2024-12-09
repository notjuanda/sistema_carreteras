/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import UsuarioService from '../services/usuario.service';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(Cookies.get('user') || '{}');
    const userRole = user?.tipo_usuario;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await UsuarioService.login(email, contraseña);
            
            if (userRole === 'administrador') {
                navigate('/panel-administracion');
            } else if (userRole === 'verificador') {
                navigate('/panel-administracion');
            }
        } catch (err) {
            setError('Credenciales incorrectas. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f4f7fc' }}>
            <Row className="justify-content-center w-100">
                <Col md={6} sm={12}>
                    <Card className="shadow-sm" style={{ borderRadius: '10px' }}>
                        <Card.Body>
                            <h3 className="text-center mb-4" style={{ color: '#1a1a1a' }}>
                                Iniciar sesión
                            </h3>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="Ingresa tu email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Ingresa tu contraseña" 
                                        value={contraseña} 
                                        onChange={(e) => setContraseña(e.target.value)} 
                                        required
                                    />
                                </Form.Group>

                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    className="w-100" 
                                    disabled={loading} 
                                    style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
                                >
                                    {loading ? 'Cargando...' : 'Iniciar sesión'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
