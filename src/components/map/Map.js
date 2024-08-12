// src/components/Map.js
import { MapContainer, Marker, TileLayer, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import pointerImage from "../../assets/pointer.png";
import { useSelector, useDispatch } from "react-redux";
import { setMarkers } from "../../store/markersSlice"; 
import { useEffect, useState } from "react";

export default function Map() {
    const markers = useSelector((state) => state.markers);
    const dispatch = useDispatch();

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
        const newMarker = { geocode: [lat, lng], type: `Bicycle` };
        dispatch(setMarkers([...markers, newMarker]));
    };

    const MapEventsHandler = ({ handleMapClick }) => {
        useMapEvents({
            click: (e) => handleMapClick(e),
        });
        return null;
    };

    const CustomZoomControl = () => {
        const map = useMap();

        useEffect(() => {
            map.zoomControl.setPosition('bottomright');
        }, [map]);

        return null;
    };

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
            <MapContainer 
                center={[41.3870, 2.1700]} 
                zoom={13} 
                minZoom={0} 
                maxZoom={20}
            >
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
                            <Popup>{marker.type}</Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>

                <MapEventsHandler handleMapClick={handleMapClick} />
                <CustomZoomControl />
            </MapContainer>

            {/* Render the marker list card on top of the map */}
            
        </div>
    );
}
