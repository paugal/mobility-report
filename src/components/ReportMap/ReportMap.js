import React from "react";
import MyLocation from "../MiLocation/MyLocation";
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

export default function ({ setLocationForm }) {
  const [location, setLocation] = useState(null);

  const customIcon = new Icon({
    iconUrl: pointerSvg,
    iconSize: [38, 38],
  });

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setLocation([lat, lng]);
    setLocationForm({ ["lat"]: lat, ["lng"]: lng });
  };

  const MapEventsHandler = ({ handleMapClick }) => {
    useMapEvents({
      click: (e) => handleMapClick(e),
    });
    return null;
  };

  return (
    <div>
      <MapContainer
        center={[41.387, 2.17]}
        zoom={13}
        minZoom={0}
        maxZoom={20}
        style={{ height: "350px", width: "430px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.REACT_APP_STADIA_MAP_KEY}`}
        />
        {location != null ? (
          <Marker
            position={[location[0], location[1]]}
            icon={customIcon}
          ></Marker>
        ) : null}

        <MyLocation />
        <MapEventsHandler handleMapClick={handleMapClick} />
      </MapContainer>
    </div>
  );
}
