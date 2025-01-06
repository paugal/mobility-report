import { Icon, divIcon, point } from "leaflet";
import pointerBus from "../../assets/pointers/train.svg";
import pointerMetro from "../../assets/pointers/metro.svg";
import pointerPedestrian from "../../assets/pointers/pedestrian.svg";
import pointerTrain from "../../assets/pointers/train.svg";
import pointerTram from "../../assets/pointers/tram.svg";
import pointerStation from "../../assets/pointers/K001.png";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

export function getCustomIcon(type) {
  const iconMap = {
    Bus: pointerBus,
    Metro: pointerMetro,
    Pedestrian: pointerPedestrian,
    Train: pointerTrain,
    Tram: pointerTram,
    STATION: pointerStation,
  };
  return new Icon({
    iconUrl: iconMap[type] || pointerMetro,
    iconSize: [38, 38],
  });
}

export function createCustomClusterIcon(cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
}

export function RecenterControl() {
  const map = useMap();

  useEffect(() => {
    const recenterButton = L.control({ position: "topright" });

    recenterButton.onAdd = () => {
      const button = L.DomUtil.create("button", "recenter-button");
      button.innerHTML = "Recenter";
      button.onclick = () => {
        map.locate({ setView: true, maxZoom: 16 });
      };
      return button;
    };

    recenterButton.addTo(map);

    return () => {
      recenterButton.remove();
    };
  }, [map]);

  return null;
}
