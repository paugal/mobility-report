import React, { useState } from "react";
import Charts from "../../components/Charts/Charts";
import "./dashboard.css";
import { useTranslation } from "react-i18next";

const OptionButton = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`optionButton ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default function Dashboard() {
  const [mobilityType, setMobilityType] = useState("Bus");
  const [year, setYear] = useState("2018");
  const { t } = useTranslation();

  // Mobility types and years
  const mobilityTypes = ["Bus", "Metro"];
  const years = ["All", "2018", "2019", "2020", "2021", "2022", "2023", "2024"];

  return (
    <div className="dashboardPage">
      <div className="dashboardContainer">
        <h1>{t("dashboard")}</h1>

        <div className="filterDashboardGroup">
          <div>
            <h3>{t("mobilityType")}</h3>
            <div className="filterDashboard">
              {mobilityTypes.map((type) => (
                <OptionButton
                  key={type}
                  label={type}
                  isActive={mobilityType === type}
                  onClick={() => setMobilityType(type)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3>{t("year")}</h3>
            <div className="filterDashboard">
              {years.map((yearOption) => (
                <OptionButton
                  key={yearOption}
                  label={yearOption}
                  isActive={year === yearOption}
                  onClick={() => setYear(yearOption)}
                />
              ))}
            </div>
          </div>
        </div>

        <Charts mobility_type={mobilityType} year={year} />
      </div>
    </div>
  );
}
