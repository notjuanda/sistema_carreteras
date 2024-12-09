/* eslint-disable react/prop-types */
import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Button } from 'react-bootstrap';

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '400px',
};
const defaultCenter = {
    lat: -16.2902,
    lng: -63.5887,
};
const options = {
    disableDefaultUI: false,
    zoomControl: true,
};

const MapComponent = ({ initialPoints = [], onPointsChange }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [markers, setMarkers] = useState(initialPoints);

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const handleMapClick = useCallback((event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const newMarker = { lat, lng };
        setMarkers((current) => {
            const updatedMarkers = [...current, newMarker];
            onPointsChange(updatedMarkers);
            return updatedMarkers;
        });
    }, [onPointsChange]);

    const handleDeleteLast = () => {
        setMarkers((current) => {
            const updatedMarkers = current.slice(0, -1);
            onPointsChange(updatedMarkers);
            return updatedMarkers;
        });
    };

    const handleReset = () => {
        setMarkers([]);
        onPointsChange([]);
    };

    useEffect(() => {
        setMarkers(initialPoints);
    }, [initialPoints]);

    if (loadError) return <div>Error al cargar el mapa</div>;
    if (!isLoaded) return <div>Cargando mapa...</div>;

    return (
        <div>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={7}
                center={markers.length > 0 ? markers[markers.length -1] : defaultCenter}
                options={options}
                onClick={handleMapClick}
                onLoad={onMapLoad}
            >
                {markers.map((marker, index) => (
                    <Marker key={index} position={marker} />
                ))}
            </GoogleMap>
            <div className="mt-2">
                <Button variant="danger" onClick={handleDeleteLast} disabled={markers.length === 0} className="me-2">
                    Eliminar Último Punto
                </Button>
                <Button variant="secondary" onClick={handleReset} disabled={markers.length === 0}>
                    Agregar Nueva Ruta
                </Button>
            </div>
            <div className="mt-2">
                <p>Total de puntos: {markers.length}</p>
            </div>
        </div>
    );
};

export default MapComponent;
