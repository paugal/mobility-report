import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/helper/supabaseClient.js";
import "../../pages/Dashboard/dashboard.css";
import DoughnutChart from "./DoughnutChart.jsx";
import BarChart from "./BarChart";

export default function Charts({ mobility_type, year }) {
  const [dataG1, setdataG1] = useState({});
  const [dataG2, setdataG2] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase.rpc("get_reports_by_mobility", {
        mobility_mode_param: mobility_type, // Pasa el parámetro aquí
      });

      if (error) {
        console.error("Error fetching reports:", error);
      } else {
        setdataG1(data);
      }
      setLoading(false);
    };

    fetchReports();
  }, [mobility_type, year]);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase.rpc("get_reports_by_year", {
        mobility_mode_param: mobility_type,
        year: year,
      });

      if (error) {
        console.error("Error fetching reports:", error);
      } else {
        setdataG2(data);
      }

      setLoading(false);
    };

    fetchReports();
  }, [mobility_type, year]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* <ul>
        {reports.map((report, index) => (
          <li key={index}>
            {report.type} - {report.problem_count}
          </li>
        ))}
      </ul> */}
      <div className="listCharts">
        <div className="chartContainer">
          <h2>Mobility Mode: {mobility_type}</h2>
          <DoughnutChart
            chartData={{
              labels: dataG1.map((el) => el.type),
              datasets: [
                {
                  label: "Report Count",
                  data: dataG1.map((el) => el.problem_count),
                },
              ],
            }}
          />
        </div>
        <div className="chartContainer">
          <h2>
            Mobility Mode: {mobility_type}, Year: {year}
          </h2>
          <BarChart
            chartData={{
              labels: dataG2.map((el) => el.type),
              datasets: [
                {
                  label: "Report Count",
                  data: dataG2.map((el) => el.problem_count),
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* CREATE OR REPLACE FUNCTION get_reports_by_mobility(mobility_mode_param text)
RETURNS TABLE(type text, problem_count int) AS $$
  SELECT type, COUNT(*) AS problem_count
  FROM reports
  WHERE mobility_mode = mobility_mode_param
  GROUP BY type
  ORDER BY problem_count DESC;
$$ LANGUAGE sql STABLE; */
