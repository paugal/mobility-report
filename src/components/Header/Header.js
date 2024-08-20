import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const location = useLocation(); // Get the current path

  return (
    <div className="header">
      <h1 className="montserrat-title">MORE: Mobility Report</h1>
      <div className="navbar">
        <Link
          id="map"
          to="/map"
          className={location.pathname === "/map" ? "active" : ""}
        >
          Map
        </Link>
        <Link
          id="report"
          to="/report"
          className={location.pathname === "/report" ? "active" : ""}
        >
          Report
        </Link>
        <Link
          id="about"
          to="/aboutus"
          className={location.pathname === "/aboutus" ? "active" : ""}
        >
          About
        </Link>
      </div>
    </div>
  );
}
