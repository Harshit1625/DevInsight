const Log = require("./models/Log");
const Group = require("./models/Group");
const summarise = require("./summarizer");
const logger = require("./utils/logger");
const axios = require('axios');
async function fingerprintLog(message, meta) {
  // simple fingerprint: normalize message, remove numbers and stack traces
  const normalized = (message || "")
    .replace(/\d+/g, "")
    .replace(/at\s+.*\(.+?:\d+\)/g, "") // remove simple stack lines
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
  return normalized;
}

module.exports = async function processLog(data) {
  logger.info(data);
  try {
    const log = await Log.findById(data.logId);
    console.log("Log" + log);
    if (!log) return;

    // simple cleanUp
    const cleaned = {
      message: log.message,
      meta: log.meta,
    };

    //AI Summary
    const summary = await summarise(cleaned.message, cleaned.meta);

    //fingerprint detection
    const fp = await fingerprintLog(cleaned.message, cleaned.meta);
    let group = await Group.findOne({ fingerprint: fp });
    if (group) {
      group.count = group.count + 1;
      group.lastseen = new Date();
      group.sampleLogId = group.sampleLogId || log._id;
      await group.save();
    } else {
      group = await Group.create({
        title: summary.slice(0, 120),
        fingerprint: fp,
        sampleLogId: log._id,
      });
    }

    log.summary = summary;
    log.processed = true;
    log.groupId = group._id;
    await log.save();

    logger.info("Log Processed", { log: log._id });

    //Notify Backend -> backend broadcasts WebSocket event
    if (process.env.BACKEND_URL) {
      try {
        await axios.post(
          `${process.env.BACKEND_URL}/api/ws/log-updated`,
          { logId: log._id },
          { timeout: 5000 }
        );
        logger.info("Notified backend of processed log", { log: log._id });
      } catch (notifyErr) {
        logger.error("Failed notifying backend: " + notifyErr);
      }
    } else {
      logger.warn("BACKEND_URL not set → cannot notify backend");
    }

    return;
  } catch (error) {
    logger.error("Error processing log:", error);
    throw error;
  }
};
