import * as turf from "@turf/turf";

export async function fetchNeighborhoodsData() {
  try {
    const response = await fetch(
      `${process.env.PUBLIC_URL}/data/Barcelona-barris.geojson`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return null;
  }
}

export function getPointNeighborhoods(points, neighborhoodsData) {
  if (!neighborhoodsData) {
    console.error("No neighborhood data provided.");
    return points.map((point) => ({ ...point, neighborhood: "Unknown" }));
  }

  return points.map((point) => {
    const { latitude, longitude, id } = point;
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
      return false;
    });

    return {
      ...point,
      neighborhood: neighborhood ? neighborhood.properties.NOM : "Unknown",
    };
  });
}
