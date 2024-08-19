import React from "react";
import { useSelector } from "react-redux";
import "./MarkerListCard.css";

export default function MarkerListCard() {
  const markers = useSelector((state) => state.markers);
  return (
    <div className="card">
      <h2>Filters</h2>
      {/* <ul>
        {markers.map((marker, index) => (
          <li key={index}>
            <strong>Marker {index + 1}:</strong> {marker.type}
          </li>
        ))}
      </ul> */}
      <h4>Mode</h4>
      <input type="checkbox" name="bus" id="bus" />{" "}
      <label htmlFor="bus">Bus</label>
      <input type="checkbox" name="metro" id="metro" />{" "}
      <label htmlFor="metro">Metro</label>
      <input type="checkbox" name="tram" id="tram" />{" "}
      <label htmlFor="tram">Tram</label>
      <h4>Date</h4>
      <label htmlFor="from">From</label>
      <input type="datetime-local" name="from" id="from" />
      <label htmlFor="to">To</label>
      <input type="datetime-local" name="to" id="to" />
    </div>
  );
}
