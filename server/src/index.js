//mobility-report/server/src/index.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const nodemailer = require("nodemailer");
require("dotenv").config();

const deviceController = require("./controller/device.controller");
const deviceMiddleware = require("./middleware/device.middleware");
const supabaseMiddleware = require("./middleware/supabase.middleware");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Add supabase to request object
app.use(supabaseMiddleware(supabase));

// Add device middleware after supabase middleware
app.use(deviceMiddleware);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Mobility Report API" });
});

// Device routes
app.post("/api/devices/identify", deviceController.identify);
app.get("/api/protected/verify-device", deviceController.verifyDevice);

// Add device info to requests that need it
app.use("/api/protected/*", (req, res, next) => {
  if (!req.device) {
    return res.status(403).json({ error: "Device identification required" });
  }
  next();
});

// Example protected route
app.post("/api/protected/like-comment", async (req, res) => {
  const { commentId } = req.body;
  const deviceId = req.device.id;

  // Your like logic here using deviceId instead of userId

  res.json({ success: true });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
