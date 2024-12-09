import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const HeaderAdministrador = () => {
    const navigate = useNavigate();
    const user = JSON.parse(Cookies.get('user') || '{}');
    const userType = user?.tipo_usuario;

    const handleLogout = () => {
        Cookies.remove('authToken');
        Cookies.remove('user');
        Cookies.remove('userType');
        navigate('/');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/panel-administracion">Sistema de Carreteras</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/panel-administracion">Carreteras</Nav.Link>
                        <Nav.Link as={Link} to="/panel-administracion/municipios">Municipios</Nav.Link>
                        <Nav.Link as={Link} to="/panel-administracion/incidentes">Incidentes</Nav.Link>
                        <Nav.Link as={Link} to="/panel-administracion/incidentes/tipos">Tipos de incidentes</Nav.Link>
                        <Nav.Link as={Link} to="/panel-administracion/solicitudes">Solicitudes</Nav.Link>
                        {userType === 'administrador' && (
                            <NavDropdown title="Historial" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/panel-administracion/usuarios">
                                    Todos los usuarios
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/panel-administracion/historial">
                                    Todo el historial
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/panel-administracion/historial-caminos">
                                    Historial de caminos
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                    <Nav>
                        <NavDropdown title="Mi Cuenta" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={handleLogout}>Cerrar sesión</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default HeaderAdministrador;
