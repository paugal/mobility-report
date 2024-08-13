import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//Leaflet
import { MapContainer, Marker, TileLayer, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import pointerImage from "../../assets/pointer.png";

//Store
import { setMarkers, fetchMarkers, addMarker } from "../../store/markersSlice";
/* import { addMarkerRealtime, updateMarkerRealtime, deleteMarkerRealtime } from "../../store/markerSlice";*/

//Components
import PopUpMarker from "../PopUpMarker/PopUpMarker"

export default function Map() {
    const markers = useSelector((state) => state.markers);
    const dispatch = useDispatch();

    /*REALTIME*/
    /* useEffect(() => {
        // Fetch initial markers
        dispatch(fetchMarkers());

        // Subscribe to real-time updates
        const subscription = supabase
          .from('markers')
          .on('INSERT', payload => {
              dispatch(addMarkerRealtime({
                  geocode: [payload.new.latitude, payload.new.longitude],
                  type: payload.new.type,
                  id: payload.new.id
              }));
          })
          .on('UPDATE', payload => {
              dispatch(updateMarkerRealtime({
                  geocode: [payload.new.latitude, payload.new.longitude],
                  type: payload.new.type,
                  id: payload.new.id
              }));
          })
          .on('DELETE', payload => {
              dispatch(deleteMarkerRealtime({ id: payload.old.id }));
          })
          .subscribe();

        // Cleanup on unmount
        return () => {
            supabase.removeSubscription(subscription);
        };
    }, [dispatch]); */

    useEffect(() => {
        // Dispatch the thunk action to fetch markers
        dispatch(fetchMarkers());
    }, [dispatch]);

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
        const newMarker = {
            latitude: lat,
            longitude: lng,
            type: `Metro`
        };
        console.log(newMarker)
        /* dispatch(setMarkers([...markers, newMarker])); */
        dispatch(addMarker({
            latitude: lat,
            longitude: lng,
            type: newMarker.type
        }));
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
                    url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.REACT_APP_STADIA_MAP_KEY}`}
                />
                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createCustomClusterIcon}
                >
                    {markers.map(marker => (
                        <Marker key={marker.id} position={[marker.latitude, marker.longitude]} icon={customIcon}>
                            <PopUpMarker data={marker} />
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
