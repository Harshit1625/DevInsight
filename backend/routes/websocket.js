const express = require("express");
const Log = require("../models/Log");

const router = express.Router();

router.post("/log-updated", async (req, res) => {
  try {
    const { logId } = req.body;
    if (!logId) return res.status(400).json({ error: "logId required" });

    const log = await Log.findById(logId).lean();
    if (!log) return res.status(404).json({ error: "Log not found" });

    const io = req.app.get("io");
    if (io) {
      io.emit("log_updated", log);
    }

    return res.json({ ok: true });
  } catch (error) {
    logger.error("ws log-updation error: " + error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router; 
