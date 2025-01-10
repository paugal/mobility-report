import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Icon } from "leaflet";
import pointerSvg from "../../assets/pointers/metro.svg";
import { useSelector, useDispatch } from "react-redux";
import { fetchStationData, fetchBusStationData } from "../../lib/util/util.js";
import { RecenterControl } from "../../lib/util/mapsUtility.js";
import MyLocation from "../MiLocation/MyLocation";
import NearStations from "./NearStation/NearStations.jsx";

export default function ReportMap({ setLocationForm, mobilityMode }) {
  const dispatch = useDispatch();
  const showStationsList = useSelector(
    (state) => state.reports.showStationsList
  );
  const [stationSelected, setStationSelected] = useState(null);
  const [userLocation, setUserLocation] = useState(null); // User location (if available)
  const [stations, setStations] = useState([]);
  const [isLocationAvailable, setIsLocationAvailable] = useState(false); // Tracks if location is granted

  const customIcon = new Icon({
    iconUrl: pointerSvg,
    iconSize: [38, 38],
  });

  useEffect(() => {
    const loadStations = async () => {
      if (mobilityMode == "Metro") {
        const data = await fetchStationData("K001");
        setStations(data);
      } else if (mobilityMode == "Bus") {
        //SE HAN DEJADO FUERA MUCHOS BUSES POR TEMA DE RENDIMIENTO
        const data = await fetchBusStationData("K014");
        setStations(data);
      }
    };
    loadStations();
  }, [mobilityMode]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setIsLocationAvailable(true);
      },
      () => {
        setIsLocationAvailable(false);
      }
    );
  }, []);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setStationSelected([lat, lng]);
    setLocationForm({ lat, lng });
  };

  const MapEventsHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  const RecenterOnLoad = () => {
    const map = useMap();
    useEffect(() => {
      if (userLocation) {
        map.setView([userLocation.latitude, userLocation.longitude], 16);
      }
    }, [userLocation]);
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
          center={
            userLocation
              ? [userLocation.latitude, userLocation.longitude]
              : [41.387, 2.17]
          }
          zoom={userLocation ? 16 : 12}
          minZoom={0}
          maxZoom={18}
          className="map-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.REACT_APP_STADIA_MAP_KEY}`}
          />

          {stationSelected && (
            <Marker position={stationSelected} icon={customIcon} />
          )}

          {stations.map((station) => (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={L.icon({
                iconUrl:
                  "https://www.barcelona.cat/estatics-planol/v0.8/img/w/bg/K/" +
                  station.type +
                  ".png",
                iconSize: [12, 12],
                iconAnchor: [6, -8],
                popupAnchor: [0, 10],
              })}
            >
              <Popup>
                {station.name}
                <button>SELECT</button>
              </Popup>
            </Marker>
          ))}

          <MyLocation
            userLocation={userLocation}
            setUserLocation={setUserLocation}
          />
          <RecenterControl />
          <MapEventsHandler />
          {userLocation && <RecenterOnLoad />}
        </MapContainer>
      )}
    </div>
  );
}
