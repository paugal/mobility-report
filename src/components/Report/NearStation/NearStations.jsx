import React, { useState, useEffect } from "react";
import {
  fetchNearestStations,
  getUserLocation,
} from "../../../lib/util/util.js";

import "./NearStation.css";

export default function NearStations({ setLocation }) {
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

  function refactorNameStation(name) {
    const newName = name.slice(6, name.length - 1).replace("-", "");
    return newName.substr(4) + " " + newName.substr(0, 4);
  }

  const handleClickNearStationList = (e) => {
    console.log(e);
    setLocation([e.latitude, e.longitude]);
  };

  return (
    <div className="near-stations">
      {openList ? (
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
                <li
                  key={index}
                  onClick={() => handleClickNearStationList(nearStation)}
                  className="near-stations__list-item"
                >
                  {refactorNameStation(nearStation.name)} -{" "}
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