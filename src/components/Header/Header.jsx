import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../constants/index";
import "./Header.css";

export default function Header() {
  const location = useLocation(); // Get the current path
  const { i18n, t } = useTranslation();

  const onChangeLang = (e) => {
    const lang_code = e.target.value;
    i18n.changeLanguage(lang_code);
  };

  return (
    <div className="header-container">
      <div className="header">
        <h1 className="montserrat-title">MORE: Mobility Report</h1>
        <div className="navbar">
          <Link
            id="map"
            to="/map"
            className={location.pathname === "/map" ? "active" : ""}
          >
            {i18n.t("map")}
          </Link>
          <Link
            id="report"
            to="/report"
            className={location.pathname === "/report" ? "active" : ""}
          >
            {i18n.t("report")}
          </Link>
          <Link
            id="dashboard"
            to="/dashboard"
            className={location.pathname === "/dashboard" ? "active" : ""}
          >
            {i18n.t("dashboard")}
          </Link>
          <select
            className="lenguageSelect"
            defaultValue={i18n.language}
            onChange={onChangeLang}
          >
            {LANGUAGES.map(({ code, label }) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
