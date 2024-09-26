import React from "react";
import Map from "../../components/Map/Map";
import MarkerListCard from "../../components/MarkerListCard/MarkerListCard";
import Header from "../../components/Header/Header";
import { supabase } from "../../lib/helper/supabaseClient";
import { useEffect, useState } from "react";
import "./Main.css";

import { Routes, Route } from "react-router-dom";

import { getUserLocation } from "../../lib/util/util";
import Report from "../Report/Report";
import Dashboard from "../Dashboard/Dashboard";

export default function Main() {
  const [markers, setMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    getMarkers();
  }, []);

  async function getMarkers() {
    try {
      const { data, error } = await supabase
        .from("markers")
        .select("*")
        .limit(10);
      if (error) throw error;
      if (data != null) {
        setMarkers(data);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    getUserLocation(
      (location) => {
        setUserLocation(location);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, []);

  return (
    <div className="mainBox">
      <Header />
      <Routes>
        <Route path="/" element={<Map userLocation={userLocation} />} />
        <Route path="/map" element={<Map userLocation={userLocation} />} />
        <Route path="/report" element={<Report></Report>} />
        <Route path="/dashboard" element={<Dashboard></Dashboard>} />
      </Routes>
    </div>
  );
}
