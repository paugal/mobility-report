import React from "react";
import { Popup } from "react-leaflet";

import { useDispatch } from "react-redux";

import { deleteMarker } from "../../store/markersSlice";
import "./PopUpMarker.css";

import { useTranslation } from "react-i18next";

export default function PopUpMarker({ data }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const removeMarker = (e) => {
    dispatch(deleteMarker(data.id));
  };
  return (
    <Popup>
      <h3>{data.type}</h3>
      <h4>Infrastructure</h4>
      <h5>Elevator</h5>
      <div className="popUpOptions">
        <button className="removeMarker" onClick={removeMarker}>
          {t("remove")}
        </button>
      </div>
    </Popup>
  );
}
