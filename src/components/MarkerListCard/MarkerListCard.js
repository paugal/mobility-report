import React from "react";
import { useSelector } from "react-redux";
import "./MarkerListCard.css";

export default function MarkerListCard() {
  const markers = useSelector((state) => state.markers);
  return (
    <div className="card-filters">
      <h2>Filters</h2>
      {/* <ul>
        {markers.map((marker, index) => (
          <li key={index}>
            <strong>Marker {index + 1}:</strong> {marker.type}
          </li>
        ))}
      </ul> */}
      <h4>Mode</h4>
      <div>
        <input type="checkbox" name="bus" id="bus" />{" "}
        <label htmlFor="bus">Bus</label>
      </div>
      <div>
        <input type="checkbox" name="metro" id="metro" />{" "}
        <label htmlFor="metro">Metro</label>
      </div>
      <div>
        <input type="checkbox" name="tram" id="tram" />{" "}
        <label htmlFor="tram">Tram</label>
      </div>

      <h4>Date</h4>
      <div>
        <label htmlFor="from">From</label>
        <input type="datetime-local" name="from" id="from" />
      </div>
      <div>
        <label htmlFor="to">To</label>
        <input type="datetime-local" name="to" id="to" />
      </div>
      <div>
        <button> Reset filters</button>
        <button> Hide filters</button>
      </div>
    </div>
  );
}
