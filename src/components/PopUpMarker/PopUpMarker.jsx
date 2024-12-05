import React, { useState, useEffect } from "react";
import { Popup } from "react-leaflet";
import { useDispatch } from "react-redux";
import { deleteMarker } from "../../store/markersSlice";
import "./PopUpMarker.css";
import { supabase } from "../../lib/helper/supabaseClient.js";
import { useTranslation } from "react-i18next";

export default function PopUpMarker({ data }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [endorsed, setEndorsed] = useState(false);
  const [reportData, setReportData] = useState(null);

  const removeMarker = (e) => {
    dispatch(deleteMarker(data.id));
  };
  const changeShowDetails = (e) => {
    setShowDetails(!showDetails);
  };
  const changeEndorsed = (e) => {
    setEndorsed(!endorsed);
  };

  useEffect(() => {
    const fetchPopupData = async () => {
      const { data: popupData, error } = await supabase.rpc("get_info_popup", {
        marker_id_arg: data.id,
      });

      if (error) {
        console.error("Error fetching reports by mobility:", error);
      } else {
        setReportData(popupData);
      }
    };

    fetchPopupData();
  }, [data]);

  return (
    <Popup>
      <div className="popUpContainer">
        <h2 className="popupTitle">{data.type}</h2>
        <h3 className="popupSubtitle">{reportData?.type}</h3>

        {!showDetails && reportData && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              justifyContent: "space-between",
            }}
          >
            <span className="popupIssue">{reportData.details}</span>
            <span className="popupDate">{reportData.created_at}</span>
          </div>
        )}

        {showDetails && reportData && (
          <div className="moreDetails">
            <p className="popupIssue">
              <strong>Issue:</strong> {reportData.details}
            </p>
            <p className="popupDateFull">
              <strong>Date:</strong> {reportData.created_at}
            </p>
            <p className="popupDescription">
              <strong>Description:</strong> {reportData.description}
            </p>
            <p className="popupUser">
              <strong>User:</strong> {reportData.email}
            </p>
            <p className="popupStatus">
              <strong>Status:</strong> {reportData.status || "N/A"}
            </p>
            <p className="popupLikes">{reportData.likes || 0} Likes</p>
          </div>
        )}

        <div className="popUpOptions">
          <button className="showDetails" onClick={changeShowDetails}>
            {showDetails ? "Hide Details" : "Details"}
          </button>

          {!showDetails ? (
            <button className="endorse" onClick={changeEndorsed}>
              <span className="material-symbols-outlined material-icons-filled">
                favorite
              </span>
              Endorse
            </button>
          ) : (
            <button className="removeMarker" onClick={removeMarker}>
              Remove
            </button>
          )}
        </div>
      </div>
    </Popup>
  );
}
