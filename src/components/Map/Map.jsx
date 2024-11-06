import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Map.css";

import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { Icon, divIcon, point } from "leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import pointerImage from "../../assets/pointer.png";
import pointerSvg from "../../assets/svgpointer.svg";

import pointerBus from "../../assets/pointers/train.svg";
import pointerMetro from "../../assets/pointers/metro.svg";
import pointerPedestrian from "../../assets/pointers/pedestrian.svg";
import pointerTrain from "../../assets/pointers/train.svg";
import pointerTram from "../../assets/pointers/tram.svg";
import pointerStation from "../../assets/pointers/K001.png";

import { setMarkers, fetchMarkers, addMarker } from "../../store/markersSlice";

import PopUpMarker from "../PopUpMarker/PopUpMarker";
import MyLocation from "../MiLocation/MyLocation";
import { getUserLocation } from "../../lib/util/util";
import MarkerListCard from "../MarkerListCard/MarkerListCard";

import { fetchStationData } from "../../lib/util/util";
import { fetchStationDataJSONSimply } from "../../lib/util/util";

function InsideMap() {
  const markers = useSelector((state) => state.markers);
  const dispatch = useDispatch();
  const [stations, setStations] = useState([]);
  const [userLocation, setUserLocation] = useState();

  useEffect(() => {
    const loadStations = async () => {
      const data = await fetchStationData("K001");
      setStations(data);
    };

    loadStations();
  }, []);

  /* useEffect(() => {
    const loadStations = async () => {
      const data = await fetchStationDataJSONSimply();
      setStations(data);
    };

    loadStations();
  }, []); */

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
      case "STATION":
        iconUrl = pointerStation;
        break;
      default:
        iconUrl = pointerMetro;
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
      iconSize: point(33, 33, true),
    });
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    const newMarker = {
      latitude: lat,
      longitude: lng,
      type: `Metro`,
    };

    dispatch(
      addMarker({
        latitude: lat,
        longitude: lng,
        type: newMarker.type,
      })
    );
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
      map.zoomControl.setPosition("bottomright");
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
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            icon={getCustomIcon(marker.type)}
          >
            <PopUpMarker data={marker} />
          </Marker>
        ))}
      </MarkerClusterGroup>
      {stations.map((station) => (
        <Marker
          key={station.id}
          position={[station.latitude, station.longitude]}
          icon={L.icon({
            iconUrl:
              "https://www.barcelona.cat/estatics-planol/v0.8/img/w/bg/K/" +
              station.type +
              ".png",
            iconSize: [8, 8], // Adjust size as needed
            iconAnchor: [16, 32], // Anchor so the icon points correctly
            popupAnchor: [0, -32], // Adjusts popup position above the icon
          })}
        >
          <Popup>{station.name}</Popup>
        </Marker>
      ))}
      <MyLocation
        userLocation={userLocation}
        setUserLocation={setUserLocation}
      />
      {/* Add marker with click */}
      {/* <MapEventsHandler handleMapClick={handleMapClick} /> */}
      <CustomZoomControl />
    </>
  );
}

export default function Map({ userLocation }) {
  const mapRef = useRef();

  useEffect(() => {
    if (userLocation && mapRef.current) {
      const map = mapRef.current;
      map.setView([userLocation.latitude, userLocation.longitude], 13); // Center the map and set zoom level
    }
  }, [userLocation]);

  return (
    <div style={{ position: "relative", flexGrow: "1", display: "flex" }}>
      <MapContainer
        center={[41.387, 2.17]}
        zoom={13}
        minZoom={0}
        maxZoom={18}
        style={{ flexGrow: 1, height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <InsideMap></InsideMap>
      </MapContainer>
      <MarkerListCard></MarkerListCard>
    </div>
  );
}
