import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import "./report.css";

import ReportMap from "../../components/Report/ReportMap";

import { fetchReports, addReport } from "../../store/reportsSlice";
import { addMarker, updateMarkerWithReport } from "../../store/markersSlice";
import { capitalizeFLetter } from "../../lib/util/util";
import ReportForm from "../../components/Report/ReportForm";
import ReportSuccess from "../../components/Report/ReportSuccess";

import jsonData from "./reportOptions.json";

export default function Report() {
  const { t } = useTranslation();
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
  const [send, setSend] = useState(false);

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

    if (name === "mobility_mode") {
      setNewMarker((prevData) => ({
        ...prevData,
        type: value,
      }));

      const problemTypes = Object.keys(
        jsonData.mobility_modes[value]?.problemTypes || {}
      );
      setAvailableProblemTypes(problemTypes);

      setFormData((prevData) => ({
        ...prevData,
        problemType: "",
        details: "",
      }));
    }

    if (name === "problemType") {
      const detailsArray =
        jsonData.mobility_modes[formData.mobility_mode]?.problemTypes[value] ||
        [];
      setAvailableDetails(detailsArray);

      setFormData((prevData) => ({ ...prevData, details: "" }));
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const create_at = new Date().toISOString();
    const newFormData = { ...formData, create_at };

    const requiredFields = [
      "mobility_mode",
      "problemType",
      "details",
      "description",
      "lat",
      "lng",
    ];
    const missingFields = requiredFields.filter((field) => !newFormData[field]);

    if (missingFields.length > 0) {
      alert(t("requiredField"));
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

      const reportResult = await dispatch(
        addReport({
          created_at: newFormData.create_at,
          mobility_mode: newFormData.mobility_mode,
          type: newFormData.problemType,
          details: newFormData.details,
          description: newFormData.description,
          email: newFormData.email,
          marker_id: markerResult.id,
        })
      ).unwrap();

      await dispatch(
        updateMarkerWithReport({
          markerId: markerResult.id,
          reportId: reportResult.id,
        })
      ).unwrap();

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
      setSend(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert(t("submissionError"));
      setSend(false);
    }
  };

  return (
    <div className="formReport">
      {send ? (
        <ReportSuccess />
      ) : (
        <ReportForm
          formData={formData}
          handleChange={handleChange}
          availableProblemTypes={availableProblemTypes}
          availableDetails={availableDetails}
          setLocation={setLocation}
          jsonData={jsonData}
          submitForm={submitForm}
        />
      )}
    </div>
  );
}
