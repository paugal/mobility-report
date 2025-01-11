import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/helper/supabaseClient.js";
import { useTranslation } from "react-i18next";

import "../../pages/Dashboard/dashboard.css";
import DoughnutChart from "./DoughnutChart.jsx";
import BarChart from "./BarChart";

export default function Charts({ mobility_type, year }) {
  const [dataG1, setDataG1] = useState([]);
  const [dataG2, setDataG2] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchReportsByMobility = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_reports_by_mobility", {
        mobility_mode_param: mobility_type,
      });

      if (error) {
        console.error("Error fetching reports by mobility:", error);
      } else {
        setDataG1(data || []);
      }
      setLoading(false);
    };

    fetchReportsByMobility();
  }, [mobility_type]);

  useEffect(() => {
    const fetchReportsByYear = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_reports_by_year", {
        mobility_mode_param: mobility_type,
        year: year,
      });

      if (error) {
        console.error("Error fetching reports by year:", error);
      } else {
        setDataG2(data || []);
      }
      setLoading(false);
    };

    fetchReportsByYear();
  }, [mobility_type, year]);

  if (loading) return <div>{t("loading")}</div>;

  // Function to get translated labels
  const getTranslatedLabels = (data) => {
    return data.map((el) => t(el.type));
  };

  return (
    <div>
      <div className="listCharts">
        <div className="chartContainer">
          <h2>{t("mobilityMode", { mobility_type })}</h2>
          {dataG1.length > 0 ? (
            <DoughnutChart
              chartData={{
                labels: getTranslatedLabels(dataG1),
                datasets: [
                  {
                    label: t("reportCount"), // Ensure you add this to your translation files
                    data: dataG1.map((el) => el.problem_count),
                  },
                ],
              }}
            />
          ) : (
            <p>{t("noDataForType")}</p>
          )}
        </div>

        <div className="chartContainer">
          <h2>{t("mobilityModeYear", { mobility_type, year })}</h2>
          {dataG2.length > 0 ? (
            <BarChart
              chartData={{
                labels: getTranslatedLabels(dataG2),
                datasets: [
                  {
                    label: t("reportCount"), // Ensure you add this to your translation files
                    data: dataG2.map((el) => el.problem_count),
                  },
                ],
              }}
            />
          ) : (
            <p>{t("noDataForType")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
