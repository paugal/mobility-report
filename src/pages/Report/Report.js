import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./report.css";

import ReportMap from "../../components/ReportMap/ReportMap";

import { fetchReports, addReport } from "../../store/reportsSlice";
import { addMarker } from "../../store/markersSlice";
import { capitalizeFLetter } from "../../lib/util/util"

import jsonData from './reportOptions.json';

export default function Report() {
  const reports = useSelector((state) => state.reports);
  const dispatch = useDispatch();
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [availableProblemTypes, setAvailableProblemTypes] = useState([]);
  const [availableDetails, setAvailableDetails] = useState([]);
  const [formData, setFormData] = useState({
    create_at: "",
    mobility_mode: "",
    problemType: "",
    details: "",
    description: "",
    email: "",
    lat: null,
    lng: null,
  });
  const [newMarker, setNewMarker] = useState({
    latitude: 0,
    longitude: 0,
    type: "Metro",
  });

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  useEffect(() => {
    if (location.lat && location.lng) {
      setFormData((prevData) => ({
        ...prevData,
        lat: location.lat,
        lng: location.lng,
      }));
      setNewMarker((prevData) => ({
        ...prevData,
        latitude: location.lat,
        longitude: location.lng,
      }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    console.log(`Changed ${name} to ${value}`); // Debug log

    if (name === "mobility_mode") {
      setNewMarker((prevData) => ({
        ...prevData,
        type: capitalizeFLetter(value),
      }));

      const selectedMode = capitalizeFLetter(value);
      console.log("selectedMode:", selectedMode)
      const problemTypes = Object.keys(jsonData.mobility_modes[selectedMode]?.problemTypes || {});
      setAvailableProblemTypes(problemTypes);

      console.log("Available Problem Types: ", problemTypes); // Debug log

      setFormData((prevData) => ({ ...prevData, problemType: '', details: '' })); // Reset problemType and details
    }

    if (name === 'problemType') {
      const selectedType = capitalizeFLetter(value);
      console.log("selectedType:", selectedType)
      const detailsArray = jsonData.mobility_modes[capitalizeFLetter(formData.mobility_mode)]?.problemTypes[selectedType] || [];
      setAvailableDetails(detailsArray);

      console.log("Available Details: ", detailsArray); // Debug log

      setFormData((prevData) => ({ ...prevData, details: '' })); // Reset details
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const create_at = new Date().toISOString();
    const newFormData = { ...formData, create_at }; // Include created_at in formData
    console.log("Form Data before submission: ", newFormData); // Debug log

    // Check for missing required fields
    const requiredFields = ["mobility_mode", "problemType", "details", "description", "lat", "lng"];
    const missingFields = requiredFields.filter((field) => !newFormData[field]);

    if (missingFields.length > 0) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const markerResult = await dispatch(
        addMarker({
          latitude: newMarker.latitude,
          longitude: newMarker.longitude,
          type: newMarker.type,
        })
      ).unwrap();

      console.log("New marker added with ID:", markerResult.id);

      dispatch(
        addReport({
          create_at: newFormData.create_at,
          mobility_mode: capitalizeFLetter(newFormData.mobility_mode),
          type: newFormData.problemType,
          details: newFormData.details,
          description: newFormData.description,
          email: newFormData.email,
          marker_id: markerResult.id,
        })
      );

      // Clear form after successful submission
      setFormData({
        create_at: "",
        mobility_mode: "",
        problemType: "",
        details: "",
        description: "",
        email: "",
        lat: null,
        lng: null,
      });
      setLocation({ lat: null, lng: null });
    } catch (error) {
      console.error("Error occurred during submission:", error);
      alert("Failed to submit the report. Please try again.");
    }
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
            <option value="" disabled>Choose one</option>
            {Object.keys(jsonData.mobility_modes).map((mode, index) => (
              <option key={index} value={mode.toLowerCase()}>{mode}</option>
            ))}
          </select>

          <label htmlFor="problemType" className="required-field">Choose the type of problem:</label>
          <select
            name="problemType"
            id="problemType"
            className="required"
            value={formData.problemType}
            onChange={handleChange}
            disabled={!formData.mobility_mode} // Disable until a mobility mode is selected
          >
            <option value="" disabled>Choose one</option>
            {availableProblemTypes.map((type, index) => (
              <option key={index} value={type.toLowerCase()}>{type}</option>
            ))}
          </select>

          <label htmlFor="details" className="required-field">Specify the problem:</label>
          <select
            name="details"
            id="details"
            className="required"
            value={formData.details}
            onChange={handleChange}
            disabled={!formData.problemType} // Disable until a problem type is selected
          >
            <option value="" disabled>Choose one</option>
            {availableDetails.map((detail, index) => (
              <option key={index} value={detail.toLowerCase()}>{detail}</option>
            ))}
          </select>

          <label htmlFor="description" className="required-field">Description:</label>
          <textarea
            name="description"
            id="description"
            className="required"
            value={formData.description}
            onChange={handleChange}
          ></textarea>

          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange}
            placeholder="Enter your email (optional)" 
          />
          <span>If you provide your email, we can notify you about your report's resolution.</span>
        </div>
        <div className="mapColum">
          <label className="required-field">Select a location:</label>
          <ReportMap setLocationForm={setLocation}></ReportMap>
        </div>
      </div>

      <div className="buttonBox">
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}
