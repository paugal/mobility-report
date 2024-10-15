import React, { useState } from "react";
import { Popup } from "react-leaflet";
import { useDispatch } from "react-redux";
import { deleteMarker } from "../../store/markersSlice";
import "./PopUpMarker.css";

import { useTranslation } from "react-i18next";

export default function PopUpMarker({ data }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [endorsed, setEndorsed] = useState(false);

  const removeMarker = (e) => {
    dispatch(deleteMarker(data.id));
  };
  const changeShowDetails = (e) => {
    setShowDetails(!showDetails);
  };
  const changeEndorsed = (e) => {
    setEndorsed(!endorsed);
  };

  return (
    <Popup>
      <div className="popUpContainer">
        <h2 className="popupTitle">{data.type}</h2>
        <h3 className="popupSubtitle">Infrastructure</h3>

          {!showDetails && (
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                justifyContent: "space-between",
              }} >
                <span className="popupIssue">Elevator</span>
                <span className="popupDate">19/09/24</span>
            </div>
          )}

        {showDetails && (
          <div className="moreDetails">
            <p className="popupIssue">
              <strong>Issue:</strong> Elevator
            </p>
            <p className="popupDateFull">
              <strong>Date:</strong> 14:05:23 - 19/09/24
            </p>
            <p className="popupDescription">
              <strong>Description:</strong> The light of the elevator is broken.
              I cannot see.
            </p>
            <p className="popupUser">
              <strong>User:</strong> p******@gmail.com
            </p>
            <p className="popupStatus">
              <strong>Status:</strong> pending
            </p>
            <p className="popupLikes">3 Likes</p>
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
