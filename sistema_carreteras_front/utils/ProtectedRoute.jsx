import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const navigate = useNavigate();
    const token = Cookies.get('authToken');
    const user = JSON.parse(Cookies.get('user') || '{}');
    const userRole = user?.tipo_usuario;

    useEffect(() => {
        if (!token) {
            navigate('/');
        } else if (!allowedRoles.includes(userRole)) {
            navigate('/');
        }
    }, [token, userRole, allowedRoles, navigate]);

    return children;
};

export default ProtectedRoute;
