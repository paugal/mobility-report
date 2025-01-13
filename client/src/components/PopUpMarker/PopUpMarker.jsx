import React, { useState, useEffect } from "react";
import { Popup } from "react-leaflet";
import { useDispatch } from "react-redux";
import { deleteMarker } from "../../store/markersSlice";
import "./PopUpMarker.css";
import { supabase } from "../../lib/helper/supabaseClient.js";
import { useTranslation } from "react-i18next";
import useDevice from "../../hooks/useDevice"; // Add this import

export default function PopUpMarker({ data }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [reportData, setReportData] = useState(null);
  const { hasLiked, likeReport, loading, deviceId } = useDevice();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const removeMarker = (e) => {
    dispatch(deleteMarker(data.id));
  };

  const changeShowDetails = (e) => {
    setShowDetails(!showDetails);
  };

  // const handleLike = async () => {
  //   if (isLiked) return;

  //   const success = await likeReport(reportData.id);
  //   if (success) {
  //     setIsLiked(true);
  //     setLikesCount((prev) => prev + 1);
  //   }
  // };

  const handleLike = async () => {
    if (!deviceId) {
      console.log("No device ID available - user not identified");
      return;
    }

    if (!reportData || !reportData.id) {
      console.log("No report data available:", reportData);
      return;
    }

    try {
      console.log("Attempting to like report with:", {
        deviceId,
        reportId: reportData.id,
        isLiked,
      });

      const success = await likeReport(reportData.id);
      console.log("Like response:", success);

      if (success) {
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Like error:", error);
    }
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
        setLikesCount(popupData.likes || 0);
      }
    };

    fetchPopupData();
  }, [data]);

  // Check if report is liked when reportData changes
  useEffect(() => {
    if (reportData) {
      setIsLiked(hasLiked(reportData.id));
    }
  }, [reportData, hasLiked]);

  if (loading || !reportData) return null;

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
            <p className="popupLikes">{likesCount} Likes</p>
          </div>
        )}
        <div className="popUpOptions">
          <button className="showDetails" onClick={changeShowDetails}>
            {showDetails ? "Hide Details" : "Details"}
          </button>
          {!showDetails ? (
            <button
              className={`endorse ${isLiked ? "liked" : ""}`}
              onClick={handleLike}
              disabled={isLiked}
            >
              <span className="material-symbols-outlined material-icons-filled">
                favorite
              </span>
              {isLiked ? t("endorsed") : t("endorse")} ({likesCount})
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
