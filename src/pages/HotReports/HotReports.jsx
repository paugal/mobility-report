import React, { useState, useEffect } from "react";
import "./HotReports.css";
import { supabase } from "../../lib/helper/supabaseClient.js";
import { useTranslation } from "react-i18next";

export default function HotReports() {
  const [reports, setReports] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase.rpc("get_reports");

      if (error) {
        console.error("Error fetching reports by mobility:", error);
      } else {
        setReports(data || []);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="hotReportsPage">
      <h1>Hot Reports</h1>
      <div className="reportsList">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.id} className="reportItem">
              <h2>{report.type}</h2>
              <p>
                <strong>Mode:</strong> {report.mobility_mode}
              </p>
              <p>
                <strong>Details:</strong> {report.details}
              </p>
              <p>
                <strong>Description:</strong> {report.description}
              </p>
              <p>
                <strong>Reported By:</strong> {report.email}
              </p>
              <p>
                <strong>Location:</strong> {report.latitude}, {report.longitude}
              </p>
            </div>
          ))
        ) : (
          <p>No reports available.</p>
        )}
      </div>
    </div>
  );
}
