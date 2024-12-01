import React from "react";
import MyLocation from "../MiLocation/MyLocation";
import NearStations from "./NearStation/NearStations.jsx";
import { setShowStationsList } from "../../store/reportsSlice.js";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";

import { Icon, divIcon, point } from "leaflet";

import pointerSvg from "../../assets/pointers/metro.svg";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStationData } from "../../lib/util/util.js";

export default function ReportMap({ setLocationForm }) {
  const dispatch = useDispatch();
  const showStationsList = useSelector(
    (state) => state.reports.showStationsList
  );
  const [stationSelected, setStationSelected] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: 41.3802142,
    longitude: 2.145251,
  });
  const [stations, setStations] = useState([]);

  const customIcon = new Icon({
    iconUrl: pointerSvg,
    iconSize: [38, 38],
  });

  useEffect(() => {
    const loadStations = async () => {
      const data = await fetchStationData("K001");
      setStations(data);
    };

    loadStations();
  }, []);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setStationSelected([lat, lng]);
    setLocationForm({ ["lat"]: lat, ["lng"]: lng });
  };

  const MapEventsHandler = ({ handleMapClick }) => {
    useMapEvents({
      click: (e) => handleMapClick(e),
    });
    return null;
  };

  const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
  };

  const FitMapToBounds = () => {
    const map = useMap();
    useEffect(() => {
      const userPoint = [userLocation.latitude, userLocation.longitude];
      const stationPoint = [stationSelected[0], stationSelected[1]];
      const bounds = L.latLngBounds(userPoint, stationPoint);
      map.fitBounds(bounds, { padding: [50, 50] });
    }, [stationSelected]);
    return null;
  };

  return (
    <div>
      {showStationsList ? (
        <NearStations
          setLocation={setStationSelected}
          userLocation={userLocation}
        />
      ) : (
        <MapContainer
          center={[41.387, 2.17]}
          zoom={16}
          minZoom={0}
          maxZoom={18}
          style={{ height: "350px", width: "430px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.REACT_APP_STADIA_MAP_KEY}`}
          />
          {stationSelected != null ? (
            <div>
              <Marker
                position={[stationSelected[0], stationSelected[1]]}
                icon={customIcon}
              ></Marker>
              <FitMapToBounds></FitMapToBounds>
            </div>
          ) : null}

          {stations.map((station) => (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={L.icon({
                iconUrl:
                  "https://www.barcelona.cat/estatics-planol/v0.8/img/w/bg/K/" +
                  station.type +
                  ".png",
                iconSize: [12, 12], // Adjust size as needed
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
          <MapEventsHandler handleMapClick={handleMapClick} />
          <RecenterAutomatically
            lat={userLocation.latitude}
            lng={userLocation.longitude}
          />

          {stationSelected == null ? (
            <RecenterAutomatically
              lat={userLocation.latitude}
              lng={userLocation.longitude}
            />
          ) : null}
        </MapContainer>
      )}
    </div>
  );
}
