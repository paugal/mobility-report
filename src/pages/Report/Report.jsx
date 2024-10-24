import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import "./report.css";

import ReportMap from "../../components/ReportMap/ReportMap";

import { fetchReports, addReport } from "../../store/reportsSlice";
import { addMarker, updateMarkerWithReport } from "../../store/markersSlice";
import { capitalizeFLetter } from "../../lib/util/util";

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
        <div className="report-send">
          <h1>{t("ThanksReport")}</h1>
          <h2>{t("ThanksReportSub")}</h2>
          <div className="success-animation">
            <div className="circle-check"></div>
          </div>
        </div>
      ) : (
        <form onSubmit={submitForm} className="center-formReport">
          <h1>{t("whatDoYouWantToReport")}</h1>
          <div className="formGrid">
            <div className="textColum">
              <label htmlFor="mobility_mode" className="required-field">
                {t("chooseMobilityMode")}
              </label>
              <select
                name="mobility_mode"
                id="mobility_mode"
                className="required"
                value={formData.mobility_mode}
                onChange={handleChange}
              >
                <option value="" disabled>
                  {t("chooseOne")}
                </option>
                {Object.keys(jsonData.mobility_modes).map((mode, index) => (
                  <option key={index} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>

              <label htmlFor="problemType" className="required-field">
                {t("chooseProblemType")}
              </label>
              <select
                name="problemType"
                id="problemType"
                className="required"
                value={formData.problemType}
                onChange={handleChange}
                disabled={!formData.mobility_mode}
              >
                <option value="" disabled>
                  {t("chooseOne")}
                </option>
                {availableProblemTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <label htmlFor="details" className="required-field">
                {t("specifyProblem")}
              </label>
              <select
                name="details"
                id="details"
                className="required"
                value={formData.details}
                onChange={handleChange}
                disabled={!formData.problemType}
              >
                <option value="" disabled>
                  {t("chooseOne")}
                </option>
                {availableDetails.map((detail, index) => (
                  <option key={index} value={detail}>
                    {detail}
                  </option>
                ))}
              </select>

              <label htmlFor="description" className="required-field">
                {t("description")}
              </label>
              <textarea
                name="description"
                id="description"
                className="required"
                value={formData.description}
                onChange={handleChange}
              ></textarea>

              <label htmlFor="email">{t("email")}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("emailPlaceholder")}
              />
              <span>{t("emailNote")}</span>
            </div>
            <div className="mapColum">
              <label className="required-field">{t("selectLocation")}</label>
              <ReportMap setLocationForm={setLocation}></ReportMap>
            </div>
          </div>

          <div className="buttonBox">
            <button type="submit">{t("submit")}</button>
          </div>
        </form>
      )}
    </div>
  );
}
