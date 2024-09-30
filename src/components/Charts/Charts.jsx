import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/helper/supabaseClient.js";
import "../../pages/Dashboard/dashboard.css";
import DoughnutChart from "./DoughnutChart.jsx";
import BarChart from "./BarChart";

export default function Charts({ mobility_type, year }) {
  const [dataG1, setDataG1] = useState([]);
  const [dataG2, setDataG2] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="listCharts">
        <div className="chartContainer">
          <h2>Mobility Mode: {mobility_type}</h2>
          {dataG1.length > 0 ? (
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
          ) : (
            <p>No data available for this mobility type.</p>
          )}
        </div>

        <div className="chartContainer">
          <h2>
            Mobility Mode: {mobility_type}, Year: {year}
          </h2>
          {dataG2.length > 0 ? (
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
          ) : (
            <p>No data available for this year and mobility type.</p>
          )}
        </div>
      </div>
    </div>
  );
}
