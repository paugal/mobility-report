import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "./Filters.css";
import { useFilters } from "../../context/FilterContext.js";

export default function Filters() {
  const { filters, toggleFilter } = useFilters();
  const { t } = useTranslation();

  return (
    <div className="card-filters">
      <h2>{t("filters")}</h2>
      <h4>{t("mode")}</h4>
      <div>
        <input
          type="checkbox"
          name="bus"
          id="bus"
          checked={filters.bus}
          onChange={() => toggleFilter("bus")}
        />{" "}
        <label htmlFor="bus">{t("bus")}</label>
      </div>
      <div>
        <input
          type="checkbox"
          name="metro"
          id="metro"
          checked={filters.metro}
          onChange={() => toggleFilter("metro")}
        />{" "}
        <label htmlFor="metro">{t("metro")}</label>
      </div>
      <div>
        <input
          type="checkbox"
          name="tram"
          id="tram"
          checked={filters.tram}
          onChange={() => toggleFilter("tram")}
        />{" "}
        <label htmlFor="tram">{t("tram")}</label>
      </div>
      <h4>{t("date")}</h4>
      <div className="data-picker">
        <label htmlFor="from">{t("from")}</label>
        <input type="datetime-local" name="from" id="from" />
      </div>
      <div className="data-picker">
        <label htmlFor="to">{t("to")}</label>
        <input type="datetime-local" name="to" id="to" />
      </div>
      <div className="filter-buttons">
        <button>{t("resetFilters")}</button>
        <button>{t("hideFilters")}</button>
      </div>
    </div>
  );
}
