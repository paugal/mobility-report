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
      document.getElementsByClassName("required")
    );
    allSelects.forEach((el) => {
      if (el.value === "") {
        document.getElementById(el.id).classList.add("emptySelect");
      }else{
        document.getElementById(el.id).classList.add("fullSelect");
      }
    });
    console.log(allSelects);
  };

  return (
    <form onSubmit={submitForm} className="formReport">
      <h1>What do you want to report?</h1>
      <div className="formGrid">
        <div className="textColum">
          <label htmlFor="mobility_mode" className="required-field">Choose the mobility mode:</label>
          <select
            name="mobility_mode"
            id="mobility_mode"
            className="required"
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

          <label htmlFor="problemType" className="required-field">Choose the type of problem:</label>
          <select
            name="problemType"
            id="problemType"
            className="required"
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

          <label htmlFor="details" className="required-field">Specify the problem:</label>
          <select
            name="details"
            id="details"
            className="required"
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

          <label htmlFor="description" className="required-field">Description:</label>
          
          <textarea
            name="description"
            id="description"
            className="required"
            value={formData.description || ""}
            onChange={handleChange}
          ></textarea>
          <label htmlFor="email">Email:</label>
          <input type="email" errorMessage="Enter a valid email" />
          <span>
            If you give us your email address we can inform you of the
            resolution of your report.{" "}
          </span>
        </div>
        <div className="mapColum">
          <label className="required-field" >Select a location:</label>
          <ReportMap className="required" setLocationForm={setLocation}></ReportMap>
        </div>
      </div>

      <div className="buttonBox">
        <button>Submit</button>
      </div>
    </form>
  );
}
