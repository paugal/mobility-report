import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as Chartjs } from "chart.js/auto";

export default function DoughnutChart({ chartData }) {
  return <Doughnut data={chartData} />;
}
