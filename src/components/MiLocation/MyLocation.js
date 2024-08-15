import React, { useState, useEffect } from 'react';
import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import pointerImage from "../../assets/yourhere.svg";
import { getUserLocation } from '../../lib/util/util';

export default function MyLocation() {
  const [userLocation, setUserLocation] = useState(null); 

  const customIcon = new Icon({
    iconUrl: pointerImage,
    iconSize: [50, 50],
  });

  useEffect(() => {
    getUserLocation(
      (location) => {
        setUserLocation(location);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, []);

  return (
    <>
      {userLocation && userLocation.latitude !== undefined && userLocation.longitude !== undefined && (
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={customIcon}>
          <Popup>
            <span>You are here!</span>
          </Popup>
        </Marker>
      )}
    </>
  );
}
