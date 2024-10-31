import React, { useEffect, useState } from "react";
import * as turf from "@turf/turf";

const NeighborhoodChecker = ({ points }) => {
  const [pointNeighborhoods, setPointNeighborhoods] = useState([]);
  const [neighborhoodsData, setNeighborhoodsData] = useState(null);

  useEffect(() => {
    const fetchNeighborhoodsData = async () => {
      try {
        const response = await fetch(
          `${process.env.PUBLIC_URL}/Barcelona-barris.geojson`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const text = await response.text(); // Leer como texto primero
        const data = JSON.parse(text); // Luego intentar parsear a JSON
        setNeighborhoodsData(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchNeighborhoodsData();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (neighborhoodsData) {
      const results = points.map((point) => {
        const { latitude, longitude, id } = point; // Assuming each point has a unique 'id'
        const turfPoint = turf.point([longitude, latitude]);

        const neighborhood = neighborhoodsData.features.find((feature) => {
          const { geometry } = feature;
          if (geometry.type === "Polygon") {
            return turf.booleanPointInPolygon(
              turfPoint,
              turf.polygon(geometry.coordinates)
            );
          } else if (geometry.type === "MultiPolygon") {
            return geometry.coordinates.some((coords) =>
              turf.booleanPointInPolygon(turfPoint, turf.polygon(coords))
            );
          }
          return false; // For unexpected geometry types
        });

        return {
          ...point,
          neighborhood: neighborhood ? neighborhood.properties.NOM : "Unknown",
        };
      });

      setPointNeighborhoods(results);
    }
  }, [neighborhoodsData, points]); // Depend on neighborhoodsData to re-check when it changes

  return (
    <div>
      <h2>Point Neighborhoods</h2>
      <ul>
        {pointNeighborhoods.map((p) => (
          <li key={p.id}>
            Point ({p.latitude}, {p.longitude}) is in neighborhood:{" "}
            {p.neighborhood}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NeighborhoodChecker;
