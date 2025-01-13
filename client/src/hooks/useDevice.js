import { useState, useEffect } from "react";
import { DeviceFingerprint } from "../lib/util/fingerprint";

const API_URL = "https://mobility-report-production.up.railway.app";

const api = {
  get: (url) =>
    fetch(`${API_URL}${url}`, {
      headers: {
        "X-Device-Token": localStorage.getItem("deviceToken"),
        "X-Device-Fingerprint": localStorage.getItem("fingerprintHash"),
      },
    }).then((r) => {
      if (r.status === 403) {
        localStorage.removeItem("deviceToken");
        localStorage.removeItem("fingerprintHash");
        window.location.reload();
      }
      if (!r.ok) throw new Error("Network response was not ok");
      return r.json();
    }),

  post: (url, data) =>
    fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Device-Token": localStorage.getItem("deviceToken"),
        "X-Device-Fingerprint": localStorage.getItem("fingerprintHash"),
      },
      body: JSON.stringify(data),
    }).then((r) => {
      if (r.status === 403) {
        localStorage.removeItem("deviceToken");
        localStorage.removeItem("fingerprintHash");
        window.location.reload();
      }
      if (!r.ok) throw new Error("Network response was not ok");
      return r.json();
    }),
};

const useDevice = () => {
  const [deviceId, setDeviceId] = useState(null);
  const [likedReports, setLikedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLikes = async () => {
    try {
      const data = await api.get("/api/protected/user-likes");
      setLikedReports(data.likedReports);
    } catch (err) {
      console.error("Failed to fetch likes:", err);
    }
  };

  useEffect(() => {
    const initDevice = async () => {
      try {
        const storedToken = localStorage.getItem("deviceToken");
        const storedHash = localStorage.getItem("fingerprintHash");

        if (storedToken && storedHash) {
          try {
            const data = await api.get("/api/protected/verify-device");
            setDeviceId(data.id);
            await fetchLikes(); // Fetch likes after device verification
            setLoading(false);
            return;
          } catch {
            localStorage.removeItem("deviceToken");
            localStorage.removeItem("fingerprintHash");
          }
        }

        const fingerprint = await DeviceFingerprint.generate();
        const data = await api.post("/api/devices/identify", { fingerprint });

        localStorage.setItem("deviceToken", data.tokens[0]);
        localStorage.setItem("fingerprintHash", fingerprint.hash);
        setDeviceId(data.id);
        await fetchLikes(); // Fetch likes after new device identification
      } catch (err) {
        console.error("Device identification failed:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    initDevice();
  }, []);

  const likeReport = async (reportId) => {
    try {
      await api.post("/api/protected/like-report", { reportId });
      setLikedReports((prev) => [...prev, reportId]);
      return true;
    } catch (err) {
      console.error("Failed to like report:", err);
      return false;
    }
  };

  return {
    deviceId,
    likedReports,
    loading,
    error,
    api,
    likeReport,
    hasLiked: (reportId) => likedReports.includes(reportId),
  };
};

export default useDevice;
