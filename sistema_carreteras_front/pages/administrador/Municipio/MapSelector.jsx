/* eslint-disable react/prop-types */
import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

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

const MapSelector = ({ initialLat, initialLng, onSelect }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [marker, setMarker] = useState(
        initialLat && initialLng
            ? { lat: parseFloat(initialLat), lng: parseFloat(initialLng) }
            : null
    );

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const handleMapClick = useCallback(
        (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            setMarker({ lat, lng });
            onSelect({ lat, lng });
        },
        [onSelect]
    );

    if (loadError) return <div>Error al cargar el mapa</div>;
    if (!isLoaded) return <div>Cargando mapa...</div>;

    return (
        <div>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={7}
                center={marker || defaultCenter}
                options={options}
                onClick={handleMapClick}
                onLoad={onMapLoad}
            >
                {marker && <Marker position={marker} />}
            </GoogleMap>
            {marker ? (
                <div className="mt-2">
                    <p><strong>Latitud:</strong> {marker.lat.toFixed(8)}</p>
                    <p><strong>Longitud:</strong> {marker.lng.toFixed(8)}</p>
                </div>
            ) : (
                <div className="mt-2">
                    <p>Haz clic en el mapa para seleccionar la ubicación del municipio.</p>
                </div>
            )}
        </div>
    );
};

export default MapSelector;
