// mobility-report/client/src/hooks/useDevice.js
import { useState, useEffect } from "react";
import { DeviceFingerprint } from "../lib/util/fingerprint";

const api = {
  get: (url) =>
    fetch(url, {
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
    fetch(url, {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initDevice = async () => {
      try {
        const storedToken = localStorage.getItem("deviceToken");
        const storedHash = localStorage.getItem("fingerprintHash");

        if (storedToken && storedHash) {
          try {
            const data = await api.get("/api/protected/verify-device");
            setDeviceId(data.id);
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
      } catch (err) {
        console.error("Device identification failed:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    initDevice();
  }, []);

  return {
    deviceId,
    loading,
    error,
    api,
  };
};

export default useDevice;
