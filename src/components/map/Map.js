import { MapContainer, Marker, TileLayer, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import pointerImage from "../../assets/pointer.png";  // Import the image

export default function Map() {

    const [markers, setMarkers] = useState([
        {
            geocode: [41.3850, 2.1710],
            popUp: "Hello, I am pop up 1"
        },
        {
            geocode: [41.3870, 2.1720],
            popUp: "Hello, I am pop up 2"
        },
        {
            geocode: [41.3860, 2.1730],
            popUp: "Hello, I am pop up 3"
        }
    ])


    const customIcon = new Icon({
        iconUrl: pointerImage,
        iconSize: [38, 38]
    });

    const createCustomClusterIcon = (cluster) => {
        return new divIcon({
            html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
            className: "custom-marker-cluster",
            iconSize: point(33, 33, true)
        });
    };

    const handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        console.log(`Clicked at: ${lat}, ${lng}`);
    };

    const MapEventsHandler = ({ handleMapClick }) => {
        useMapEvents({
            click: (e) => handleMapClick(e),
        });
        return null;
    };

    return (
        <MapContainer center={[41.3870, 2.1700]} zoom={13} minZoom={0} maxZoom={20}>
            <TileLayer
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
            />
            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createCustomClusterIcon}
            >
                {markers.map((marker, index) => (
                    <Marker key={index} position={marker.geocode} icon={customIcon}>
                        <Popup>{marker.popUp}</Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>

            <MapEventsHandler handleMapClick={handleMapClick} />
        </MapContainer>
    );
};

