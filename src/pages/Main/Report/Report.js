import React, { useEffect, useState } from "react";
import "./report.css";

import ReportMap from "../../../components/ReportMap/ReportMap";

const jsonData = {
  mobility_mode: ["Train", "Bicycle", "Bus", "Tram", "Metro"],
  problemTypes: ["Infrastructure", "Service", "Security"],
  details: [
    "Escalator",
    "Elevator",
    "Platform",
    "Stairs",
    "Ticket",
    "Machine",
    "Doors",
    "Bench",
    "Others",
  ],
};

export default function Report() {
  const [formData, setFormData] = useState({
    mobility_mode: "",
    problemType: "",
    details: "",
    description: "",
    lat: null,
    lng: null,
  });

  const [location, setLocation] = useState({ lat: null, lng: null });

  useEffect(
    () => setFormData({ ...formData, lat: location.lat, lng: location.lng }),
    [location]
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = (e) => {
    e.preventDefault();
    const allSelects = Array.prototype.slice.call(
      document.getElementsByTagName("select")
    );
    allSelects.forEach((el) => {
      if (el.value === "") {
        document.getElementById(el.id).classList.add("emptySelect");
      }
    });
    console.log(allSelects);
  };

  return (
    <form onSubmit={submitForm} className="formReport">
      <h1>What do you want to report?</h1>
      <div className="formGrid">
        <div className="textColum">
          <span>Choose the mobility mode:</span>
          <select
            name="mobility_mode"
            id="mobility_mode"
            value={formData.mobility_mode}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choose one
            </option>
            {jsonData.mobility_mode.map((mobility_mode, index) => (
              <option key={index} value={mobility_mode.toLowerCase()}>
                {mobility_mode}
              </option>
            ))}
          </select>

          <span>Choose the type of problem:</span>
          <select
            name="problemType"
            id="problemType"
            value={formData.problemType}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choose one
            </option>
            {jsonData.problemTypes.map((problemType, index) => (
              <option key={index} value={problemType.toLowerCase()}>
                {problemType}
              </option>
            ))}
          </select>

          <span>Specify the problem:</span>
          <select
            name="details"
            id="details"
            value={formData.details}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choose one
            </option>
            {jsonData.details.map((details, index) => (
              <option key={index} value={details.toLowerCase()}>
                {details}
              </option>
            ))}
          </select>

          <span>Description:</span>
          <textarea
            name="description"
            id="description"
            value={formData.description || ""}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mapColum">
          <span>Select a location:</span>
          <ReportMap setLocationForm={setLocation}></ReportMap>
        </div>
      </div>

      <div className="buttonBox">
        <button>Submit</button>
      </div>
    </form>
  );
}
