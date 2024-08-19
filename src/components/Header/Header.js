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
          to="/mobility-report/map"
          className={
            location.pathname === "/mobility-report/map" ? "active" : ""
          }
        >
          Map
        </Link>
        <Link
          id="report"
          to="/mobility-report/report"
          className={
            location.pathname === "/mobility-report/report" ? "active" : ""
          }
        >
          Report
        </Link>
        <Link
          id="about"
          to="/mobility-report/aboutus"
          className={
            location.pathname === "/mobility-report/aboutus" ? "active" : ""
          }
        >
          About
        </Link>
      </div>
    </div>
  );
}
