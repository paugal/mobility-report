import React from "react";
import { useTranslation } from "react-i18next";

export default function ReportSuccess() {
  const { t } = useTranslation();
  return (
    <div className="report-send">
      <h1>{t("ThanksReport")}</h1>
      <h2>{t("ThanksReportSub")}</h2>
      <div className="success-animation">
        <div className="circle-check"></div>
      </div>
    </div>
  );
}
