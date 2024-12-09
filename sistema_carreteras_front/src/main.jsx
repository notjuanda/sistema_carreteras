import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/login';
import ProtectedRoute from '../utils/ProtectedRoute';
import ListaCarreteras from '../pages/administrador/carretera/ListaCarretera';
import ListaUsuario from '../pages/administrador/usuario/ListaUsuario';
import ListaHistorial from '../pages/administrador/historial/ListaHistorial';
import ListaHistorialCaminos from '../pages/administrador/historial/ListaHistorialCaminos';
import AgregarCarretera from '../pages/administrador/carretera/AgregarCarretera';
import CrearRutas from '../pages/administrador/carretera/CrearRutas';
import ListaMunicipio from '../pages/administrador/Municipio/ListaMunicipio';
import AgregarMunicipio from '../pages/administrador/Municipio/AgregarMunicipio';
import ListaIncidente from '../pages/administrador/incidente/ListaIncidente';
import AgregarIncidente from '../pages/administrador/incidente/AgregarIncidente';
import AgregarFotoIncidente from '../pages/administrador/incidente/AgregarFotoIncidente';
import ListaTipoIncidente from '../pages/administrador/incidente/ListaTipoIncidente';
import AgregarTipoIncidente from '../pages/administrador/incidente/AgregarTipoIncidente';
import ListaSolicitudes from '../pages/administrador/solicitudes/ListaSolicitudes';
import MapaPublico from '../pages/acceso_publico/MapaPublico';

const router = createBrowserRouter ([
  {
    path: '/',
    element: <MapaPublico />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute allowedRoles={['administrador']}>
        <Login />
      </ProtectedRoute>
    )
  },
  //administrador
  {
    path: '/panel-administracion',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'verificador']}>
        <ListaCarreteras />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/carreteras/agregar',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'verificador']}>
        <AgregarCarretera />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/carreteras/editar/:id',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'verificador']}>
        <AgregarCarretera />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/carreteras/:id/rutas',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'verificador']}>
        <CrearRutas />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/usuarios',
    element: (
      <ProtectedRoute allowedRoles={['administrador']}>
        <ListaUsuario />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/historial',
    element: (
      <ProtectedRoute allowedRoles={['administrador']}>
        <ListaHistorial />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/historial-caminos',
    element: (
      <ProtectedRoute allowedRoles={['administrador']}>
        <ListaHistorialCaminos />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/municipios',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'verificador']}>
        <ListaMunicipio />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/municipios/agregar',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'verificador']}>
        <AgregarMunicipio />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/municipios/editar/:id',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'verificador']}>
        <AgregarMunicipio />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/incidentes',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'verificador']}>
        <ListaIncidente />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/incidentes/agregar',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'verificador']}>
        <AgregarIncidente />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/incidentes/editar/:id',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'verificador']}>
        <AgregarIncidente />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/incidentes/:id/fotos',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'verificador']}>
        <AgregarFotoIncidente />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/incidentes/tipos',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'verificador']}>
        <ListaTipoIncidente />
      </ProtectedRoute>
    )
  }, 
  {
    path: '/panel-administracion/incidentes/tipo/agregar',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'verificador']}>
        <AgregarTipoIncidente />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/tipo-incidentes/editar/:id',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'verificador']}>
        <AgregarTipoIncidente />
      </ProtectedRoute>
    )
  },
  {
    path: '/panel-administracion/solicitudes',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'verificador']}>
        <ListaSolicitudes />
      </ProtectedRoute>
    )
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
