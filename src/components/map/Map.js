import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";


export default function Map() {

    const markers = [
        {
            geocode: [41.3850, 2.1710],
            popUp: "Hello, I am pop up 1"
        },
        {
            geocode: [41.3870, 2.1720],
            popUp: "Hello, I am pop up 2"
        },
        {
            geocode: [41.3860, 2.1730],
            popUp: "Hello, I am pop up 3"
        }
    ];

    return (
        <MapContainer center={[41.3870, 2.1700]} zoom={13}>
            <TileLayer
                //attribution='Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                //url='https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png' 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markers.map(marker => (
                <Marker position={marker.geocode}>

                </Marker>
            ))}
        </MapContainer>
    )
}