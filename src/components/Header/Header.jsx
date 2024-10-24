import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../constants/index";
import "./Header.css";

export default function Header() {
  const location = useLocation(); // Get the current path
  const { i18n, t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false); // State to toggle the dropdown

  // Function to toggle the language dropdown
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Change language when clicking a language option
  const onChangeLang = (lang_code) => {
    i18n.changeLanguage(lang_code); // Change the language
    setShowDropdown(false); // Close the dropdown after selection
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
          <div className="logIn">
            <Link
              id="logIn"
              to="/logIn"
              className={location.pathname === "/logIn" ? "active" : ""}
            >
              {i18n.t("logIn")}
            </Link>
          </div>

          {/* Language Selector */}
          <div className="language-container">
            <span
              className="material-symbols-outlined"
              onClick={toggleDropdown}
              style={{ cursor: "pointer" }}
            >
              translate
            </span>
            {showDropdown && (
              <div className="dropdown">
                {LANGUAGES.map(({ code, label }) => (
                  <div
                    key={code}
                    className="dropdown-item"
                    onClick={() => onChangeLang(code)}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
