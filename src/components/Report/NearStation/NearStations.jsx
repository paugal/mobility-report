import React, { useState, useEffect } from "react";
import {
  fetchNearestStations,
  getUserLocation,
} from "../../../lib/util/util.js";

import "./NearStation.css";

export default function NearStations() {
  const [nearStations, setNearStations] = useState();
  const [userLocation, setUserLocation] = useState(null);
  const [openList, setOpenList] = useState(false);

  useEffect(() => {
    const loadUserLocation = async () => {
      getUserLocation(
        (location) => {
          setUserLocation(location);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    };

    loadUserLocation();
  }, []);

  useEffect(() => {
    const loadNearStations = async () => {
      if (userLocation && userLocation.latitude && userLocation.longitude) {
        const data = await fetchNearestStations(
          userLocation.latitude,
          userLocation.longitude
        );
        setNearStations(data);
      }
    };

    loadNearStations();
  }, [userLocation]);

  const openNearStationList = (e) => {
    setOpenList(true);
  };

  return (
    <div className="near-stations">
      {!openList ? (
        <div className="near-stations__icon" onClick={openNearStationList}>
          {" "}
          Near Station List
        </div>
      ) : (
        <div className="near-stations__list">
          <h3>Near Stations</h3>
          {nearStations ? (
            <ul className="near-stations__list-items">
              {nearStations.map((nearStation, index) => (
                <li key={index} className="near-stations__list-item">
                  {nearStation.name} -{" "}
                  {Math.round(nearStation.distance * 1000) / 1000} km
                </li>
              ))}
            </ul>
          ) : (
            <div className="near-stations__loading">
              Loading near stations...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
