import { useEffect, useState, useRef  } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Map.css"

//Leaflet
import { MapContainer, Marker, TileLayer, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import pointerImage from "../../assets/pointer.png";
import pointerSvg from "../../assets/svgpointer.svg";

import pointerBus from "../../assets/pointers/train.svg"
import pointerMetro from "../../assets/pointers/metro.svg"
import pointerPedestrian from "../../assets/pointers/pedestrian.svg"
import pointerTrain from "../../assets/pointers/train.svg"
import pointerTram from "../../assets/pointers/tram.svg"


//Store
import { setMarkers, fetchMarkers, addMarker } from "../../store/markersSlice";
/* import { addMarkerRealtime, updateMarkerRealtime, deleteMarkerRealtime } from "../../store/markerSlice";*/

//Components
import PopUpMarker from "../PopUpMarker/PopUpMarker"
import MyLocation from "../MiLocation/MyLocation";
import {getUserLocation} from "../../lib/util/util"


function InsideMap(){
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
        dispatch(fetchMarkers());
    }, [dispatch]);

    const customIcon = new Icon({
        iconUrl: pointerSvg,
        iconSize: [38, 38],
    });

    const getCustomIcon = (type) => {
        let iconUrl;
        switch (type) {
            case "Bus":
                iconUrl = pointerBus;
                break;
            case "Metro":
                iconUrl = pointerMetro;
                break;
            case "Pedestrian":
                iconUrl = pointerPedestrian;
                break;
            case "Train":
                iconUrl = pointerTrain;
                break;
            case "Tram":
                iconUrl = pointerTram;
                break;
            default:
                iconUrl = pointerMetro; // Fallback icon
        }
        return new Icon({
            iconUrl,
            iconSize: [38, 38],
        });
    };

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
        <>
                <TileLayer
                    attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.REACT_APP_STADIA_MAP_KEY}`}
                />
                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createCustomClusterIcon}
                >
                    {markers.map(marker => (
                        <Marker key={marker.id} position={[marker.latitude, marker.longitude]}
                            icon={getCustomIcon(marker.type)}>
                            <PopUpMarker data={marker} />
                        </Marker>
                    ))}
                    
                </MarkerClusterGroup>
                <MyLocation/>
                <MapEventsHandler handleMapClick={handleMapClick} />
                <CustomZoomControl />
                </>
    );
}

export default function Map({userLocation}) {
    
    const mapRef = useRef();

    useEffect(() => {
        if (userLocation && mapRef.current) {
            const map = mapRef.current;
            map.setView([userLocation.latitude, userLocation.longitude], 13); // Center the map and set zoom level
        }
    }, [userLocation]);
    
    return (
        <div style={{ position: 'relative', flexGrow: "1", display: "flex" }}>
            <MapContainer
                center={[41.3870, 2.1700]}
                zoom={13}
                minZoom={0}
                maxZoom={20}
                style={{ flexGrow: 1, height: "100%", width: "100%" }}
                ref={mapRef}
            >
                <InsideMap></InsideMap>
            </MapContainer>

        </div>
    );
}
