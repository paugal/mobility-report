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

//IMPORTO LOS DATOS DEL CSV DE LAS ESTACIONES
//HAY DEMASIADOS DATOS
export async function fetchStationData(transportType = null) {
  try {
    const data = await csv(
      `${process.env.PUBLIC_URL}/data/BCN_METRO_STATIONS.csv`
    );
    return data
      .filter((row) => !transportType || row.CODI_CAPA === transportType)
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
  return dist;
}

export async function fetchNearestStations(currentLat, currentLon) {
  try {
    const response = await fetch(
      `${process.env.PUBLIC_URL}/data/BCN_STATION_SIMPLE.geojson`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const geojson = await response.json();

    // Parse and calculate distances
    const stationsWithDistance = geojson.features.map((feature) => {
      const stationName = feature.properties.NOM;
      const [longitude, latitude] = feature.geometry.coordinates[0];
      const distance = getDistanceFromLatLon(
        currentLat,
        currentLon,
        latitude,
        longitude
      );

      return {
        name: stationName,
        latitude,
        longitude,
        distance,
      };
    });

    // Sort by distance and get the nearest 10
    stationsWithDistance.sort((a, b) => a.distance - b.distance);

    return stationsWithDistance.slice(0, 10);
  } catch (error) {
    console.error(
      "There was a problem with fetching or parsing the data:",
      error
    );
    return null;
  }
}
