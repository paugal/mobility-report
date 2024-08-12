import React from 'react'
import { useSelector } from "react-redux";
import "./MarkerListCard.css"


export default function MarkerListCard() {
    const markers = useSelector((state) => state.markers);
    return (
        <div className='card'>
            <h3>Markers</h3>
            <ul>
                {markers.map((marker, index) => (
                    <li key={index}>
                        <strong>Marker {index + 1}:</strong> {marker.type}
                    </li>
                ))}
            </ul>
        </div>
    );
}



