const express = require("express");
const Log = require("../models/Log");
const { logsQueue } = require("../queue/producer");

const Group = require("../models/Group");
const logger = require("../utils/logger");
const router = express.Router();

//ingest Log
router.post("/", async (req, res) => {
  try {
    const { service, level = "error", message, meta } = req.body;
    if (!service || !message) {
      return res
        .status(400)
        .json({ error: "Service and message are required" });
    }

    const log = await Log.create({ service, level, message, meta });

    const io = req.app.get("io");
    io.emit("log_created", log);

    await logsQueue.add(
      "process_log",
      { logId: log._id, service, level },
      { attempts: 3 }
    );

    logger.info(`Log ingested with ID: ${log._id}`);
    res.status(201).json({ success: true, id: log._id });
  } catch (e) {
    logger.error("Error ingesting log:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

//fetch recent logs
router.get("/", async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    //without lean(), MongoDB would return full Mongoose documents , which have methods and internal state.
    const logs = await Log.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();
    return res.status(200).json(logs);
  } catch (e) {
    logger.error("Error fetching logs: ", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//fetch grouped issues
router.get("/groups", async (req, res) => {
  try {
    const groups = await Group.find().sort({ lastSeen: -1 }).limit(100).lean();
    return res.status(200).json(groups);
  } catch (error) {
    logger.error("Error Fetching Groups", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

module.exports = router;
