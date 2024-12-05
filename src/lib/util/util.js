import { csv } from "d3-fetch";
import * as turf from "@turf/turf";

export const getUserLocation = (onSuccess, onError) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onSuccess({ latitude, longitude });
      },
      (error) => {
        if (onError) {
          onError(error);
        } else {
          console.error("Error getting user location:", error);
        }
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};

export const capitalizeFLetter = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};

export async function fetchStationData(transportType = null) {
  try {
    const data = await csv(
      `${process.env.PUBLIC_URL}/data/BCN_METRO_STATIONS.csv`
    );
    return data
      .filter((row) => !transportType || row.CODI_CAPA === transportType)
      .filter((row) => row.EQUIPAMENT.startsWith("METRO ("))
      .map((row) => ({
        name: row.EQUIPAMENT,
        longitude: parseFloat(row.LONGITUD),
        latitude: parseFloat(row.LATITUD),
        typeName: row.NOM_CAPA,
        neighborhood: row.NOM_BARRI,
        type: row.CODI_CAPA,
        id: row.id,
      }));
  } catch (error) {
    console.error("Error loading the CSV data:", error);
    return [];
  }
}

export async function fetchStationDataJSONSimply() {
  try {
    const response = await fetch(
      `${process.env.PUBLIC_URL}/data/BCN_STATION_SIMPLE.geojson`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const geojson = await response.json();
    return geojson.features.map((feature) => {
      const stationName = feature.properties.NOM;
      const [longitude, latitude] = feature.geometry.coordinates[0];

      return {
        name: stationName,
        latitude,
        longitude,
      };
    });
  } catch (error) {
    console.error(
      "There was a problem with the fetch and parse operation:",
      error
    );
    return null;
  }
}

function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
  const from = turf.point([lon1, lat1]); // Switch to [lon, lat]
  const to = turf.point([lon2, lat2]); // Switch to [lon, lat]
  const options = { units: "kilometers" };

  const dist = turf.distance(from, to, options);
  return (Math.round(dist * 100) / 100).toFixed(2);
}

export async function fetchNearestStations(
  currentLat,
  currentLon,
  transportType = null
) {
  try {
    // Fetch station data using fetchStationData instead of a direct fetch
    const stations = await fetchStationData(transportType);

    // Parse and calculate distances
    const stationsWithDistance = stations.map((station) => {
      const { name, latitude, longitude } = station;
      const distance = getDistanceFromLatLon(
        currentLat,
        currentLon,
        latitude,
        longitude
      );

      return {
        ...station,
        distance, // Add distance to the station data
      };
    });

    // Sort by distance and get the nearest 10
    stationsWithDistance.sort((a, b) => a.distance - b.distance);

    return stationsWithDistance.slice(0, 10);
  } catch (error) {
    console.error(
      "There was a problem with fetching or processing the station data:",
      error
    );
    return null;
  }
}
