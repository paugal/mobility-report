import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShowStationsList } from "../../store/reportsSlice.js";
import { useTranslation } from "react-i18next";
import ReportMap from "./ReportMap";

export default function ReportForm({
  formData,
  handleChange,
  availableProblemTypes,
  availableDetails,
  setLocation,
  jsonData,
  submitForm,
}) {
  const dispatch = useDispatch();
  const showStationsList = useSelector(
    (state) => state.reports.showStationsList
  );
  const { t } = useTranslation();

  const MapListSwitch = (value) => {
    dispatch(setShowStationsList(value));
  };

  return (
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
          <div className="mapSwitch">
            <div onClick={() => MapListSwitch(false)}> Map </div>
            <div onClick={() => MapListSwitch(true)}> Near Stations List </div>
          </div>
          <ReportMap
            setLocationForm={setLocation}
          />
        </div>
      </div>

      <div className="buttonBox">
        <button type="submit">{t("submit")}</button>
      </div>
    </form>
  );
}
