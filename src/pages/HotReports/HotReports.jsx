import React, { useState, useEffect } from "react";
import "./HotReports.css";
import { supabase } from "../../lib/helper/supabaseClient.js";
import { useTranslation } from "react-i18next";
import {
  fetchNeighborhoodsData,
  getPointNeighborhoods,
} from "../../lib/util/neighborhoodFinder.js";

export default function HotReports() {
  const [reports, setReports] = useState([]);
  const [neighborhoodsData, setNeighborhoodsData] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const loadNeighborhoodData = async () => {
      const data = await fetchNeighborhoodsData();
      setNeighborhoodsData(data);
    };

    loadNeighborhoodData();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase.rpc("get_reports");
      if (error) {
        console.error(t("errorFetchingReports"), error);
      } else {
        setReports(data || []);
      }
    };

    fetchReports();
  }, []);

  const getNeighborhoodForReport = (report) => {
    if (!neighborhoodsData) return t("loading");
    const point = [
      { id: report.id, latitude: report.latitude, longitude: report.longitude },
    ];
    const neighborhood = getPointNeighborhoods(point, neighborhoodsData);

    return neighborhood[0]?.neighborhood || t("unknown");
  };

  return (
    <div className="hotReportsPage">
      <div className="hotReportsPage-center">
        <h1>{t("hotreports")}</h1>
        <div className="reportsList">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="reportItem">
                <h2>{report.type}</h2>
                <p>
                  <strong>{t("mode")}:</strong> {report.mobility_mode}
                </p>
                <p>
                  <strong>{t("details")}:</strong> {report.details}
                </p>
                <p>
                  <strong>{t("description")}</strong> {report.description}
                </p>
                <p>
                  <strong>{t("reportedBy")}:</strong> {report.email}
                </p>
                <p>
                  <strong>{t("neighborhood")}:</strong>{" "}
                  {getNeighborhoodForReport(report)}
                </p>
                <p>
                  <strong>{t("likes")}:</strong> {report.likes}
                </p>
                <p>
                  <strong>{t("status")}:</strong> {report.status}
                </p>
              </div>
            ))
          ) : (
            <p>{t("noReportsAvailable")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
