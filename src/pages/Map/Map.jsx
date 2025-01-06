import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import { fetchMarkers, addMarker } from "../../store/markersSlice";
import Filters from "../../components/Filters/Filters";
import { useFilters } from "../../context/FilterContext.js";
import PopUpMarker from "../../components/PopUpMarker/PopUpMarker";
import MyLocation from "../../components/MiLocation/MyLocation";
import {
  getCustomIcon,
  createCustomClusterIcon,
} from "../../lib/util/mapsUtility.js";

export default function Map({ userLocation }) {
  const mapRef = useRef();

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView(
        [userLocation.latitude, userLocation.longitude],
        13
      );
    }
  }, [userLocation]);

  return (
    <div style={{ position: "relative", flexGrow: 1, display: "flex" }}>
      <MapContainer
        center={[41.387, 2.17]}
        zoom={13}
        minZoom={0}
        maxZoom={18}
        style={{ flexGrow: 1, height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <InsideMap />
      </MapContainer>
      <Filters />
    </div>
  );
}

function InsideMap() {
  const dispatch = useDispatch();
  const { filters } = useFilters();
  const markers = useSelector((state) => state.markers);
  const [userLocation, setUserLocation] = useState(null);
  const [filteredMarkers, setFilteredMarkers] = useState([]);

  useEffect(() => {
    const activeFilters = Object.entries(filters)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => key);

    if (activeFilters.length === 0) {
      setFilteredMarkers([]);
    } else {
      const newFilteredMarkers = markers.filter((marker) =>
        activeFilters.includes(marker.type.toLowerCase())
      );
      setFilteredMarkers(newFilteredMarkers);
    }
  }, [filters, markers]);

  useEffect(() => {
    dispatch(fetchMarkers());
  }, [dispatch]);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    // dispatch(addMarker({ latitude: lat, longitude: lng, type: "Metro" }));
  };

  useMapEvents({
    click: handleMapClick,
  });

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
        {filteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            icon={getCustomIcon(marker.type)}
          >
            <PopUpMarker data={marker} />
          </Marker>
        ))}
      </MarkerClusterGroup>
      <MyLocation
        userLocation={userLocation}
        setUserLocation={setUserLocation}
      />
      <CustomZoomControl />
    </>
  );
}

function CustomZoomControl() {
  const map = useMap();

  useEffect(() => {
    map.zoomControl.setPosition("bottomright");
  }, [map]);

  return null;
}
