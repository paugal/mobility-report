// mobility-report/server/src/middleware/device.middleware.js
const deviceMiddleware = async (req, res, next) => {
  const token = req.headers["x-device-token"];
  const fingerprintHash = req.headers["x-device-fingerprint"];
  const { supabase } = req;

  if (!token || !fingerprintHash) {
    return next();
  }

  try {
    const { data: device, error } = await supabase
      .from("devices")
      .select("*")
      .eq("fingerprint_hash", fingerprintHash)
      .contains("tokens", [token])
      .single();

    if (error) {
      console.error("Device query error:", error);
      return next();
    }

    if (device) {
      const { error: updateError } = await supabase
        .from("devices")
        .update({
          last_seen: new Date().toISOString(),
          request_count: device.request_count + 1,
          last_ip: req.ip,
        })
        .eq("id", device.id);

      if (updateError) {
        console.error("Device update error:", updateError);
      }

      req.device = device;
    }

    next();
  } catch (error) {
    console.error("Device middleware error:", error);
    next(error);
  }
};

module.exports = deviceMiddleware;
