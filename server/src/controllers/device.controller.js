// mobility-report/server/src/controller/device.controller.js
const crypto = require("crypto");

const generateToken = () => crypto.randomBytes(32).toString("hex");

const deviceController = {
  async identify(req, res) {
    const { fingerprint } = req.body;
    const { supabase } = req;

    try {
      // Check for exact match
      let { data: device, error } = await supabase
        .from("devices")
        .select("*")
        .eq("fingerprint_hash", fingerprint.hash)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (!device) {
        // Get all devices for fuzzy matching
        const { data: devices } = await supabase.from("devices").select("*");

        device = devices.find(
          (d) => calculateSimilarity(d.components, fingerprint.components) > 0.8
        );

        if (device) {
          // Update existing device
          const token = generateToken();
          const { data: updatedDevice, error: updateError } = await supabase
            .from("devices")
            .update({
              fingerprint_hash: fingerprint.hash,
              components: fingerprint.components,
              confidence_score: fingerprint.confidence,
              tokens: [...device.tokens, token],
              last_ip: req.ip,
            })
            .eq("id", device.id)
            .select()
            .single();

          if (updateError) throw updateError;
          device = updatedDevice;
        } else {
          // Create new device
          const token = generateToken();
          const { data: newDevice, error: insertError } = await supabase
            .from("devices")
            .insert({
              fingerprint_hash: fingerprint.hash,
              components: fingerprint.components,
              confidence_score: fingerprint.confidence,
              tokens: [token],
              last_ip: req.ip,
            })
            .select()
            .single();

          if (insertError) throw insertError;
          device = newDevice;
        }
      }

      res.json(device);
    } catch (error) {
      console.error("Device identification error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async verifyDevice(req, res) {
    try {
      if (!req.device) {
        return res.status(403).json({ error: "Invalid device" });
      }
      res.json(req.device);
    } catch (error) {
      console.error("Device verification error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

function calculateSimilarity(device1, device2) {
  const weights = {
    "hardware.platform": 0.3,
    "hardware.cores": 0.2,
    "software.timezone": 0.2,
  };

  let totalScore = 0;
  let totalWeight = 0;

  for (const [path, weight] of Object.entries(weights)) {
    const value1 = getNestedValue(device1, path);
    const value2 = getNestedValue(device2, path);

    if (value1 && value2) {
      totalScore += weight * (value1 === value2 ? 1 : 0);
      totalWeight += weight;
    }
  }

  return totalWeight > 0 ? totalScore / totalWeight : 0;
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((o, i) => o?.[i], obj);
}

module.exports = deviceController;
