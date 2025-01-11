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
              alignItems: "left",
              flexDirection: "column",
              gap: "0.2rem",
              justifyContent: "space-between",
            }}
          >
            <span className="popupIssue">{reportData.details}</span>
            <span className="popupDate">
              {reportData.created_at
                ? reportData.created_at.slice(0, 10)
                : "N/A"}{" "}
            </span>
          </div>
        )}

        {showDetails && reportData && (
          <div className="moreDetails">
            <p className="popupIssue">
              <strong>{t("issue")}:</strong> {reportData.details}
            </p>
            <p className="popupDateFull">
              <strong>{t("date")}:</strong> {reportData.created_at.slice(0, 10)}{" "}
              {t("at")} {reportData.created_at.slice(11, 19)}
            </p>
            <p className="popupDescription">
              <strong>{t("description")}</strong> {reportData.description}
            </p>
            <p className="popupUser">
              <strong>{t("user")}:</strong>{" "}
              {reportData.email ? reportData.email : "anonimo"}
            </p>
            <p className="popupStatus">
              <strong>{t("status")}:</strong> {reportData.status || "N/A"}
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
              {t("endorse")}
            </button>
          ) : (
            <button className="removeMarker" onClick={removeMarker}>
              {t("remove")}
            </button>
          )}
        </div>
      </div>
    </Popup>
  );
}
