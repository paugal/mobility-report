import React from 'react'
import { Popup } from "react-leaflet";

import { useDispatch } from "react-redux";

import { deleteMarker } from "../../store/markersSlice";


export default function PopUpMarker({ data }) {
    const dispatch = useDispatch();

    const removeMarker = (e) => {
        console.log(data.id)
        dispatch(deleteMarker(data.id));
    };
    return (
        <Popup>
            <span>type: {data.type}</span>
            <div className='popUpOptions'>
                <button onClick={removeMarker}>Remove</button>
            </div>
        </Popup>
    )
}
