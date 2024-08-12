import "./styles.css";
import Map from "./components/Map/Map";
import { MapContainer, TileLayer} from "react-leaflet";

export default function App() {
  return (
    <div className="App">
      <h1>Traffic Map</h1>
      <Map/>
    </div>
  );
}
