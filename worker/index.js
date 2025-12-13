require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const processLog = require("./logProcessor");
const logger = require("./utils/logger");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Worker connected to MongoDB");
    const port = process.env.PORT || 4001;
    app.listen(port, () => {
      logger.info(`Worker service listening on port ${port}`);
      console.log(`Worker service listening on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection failed!", err);
    process.exit(1);
  });

const queueName = process.env.QUEUE_NAME || "logs";

const worker = new Worker(
  queueName,
  async (job) => {
    logger.info({ jobId: job.id, name: job.name }, "Processing job");
    if (job.name === "process_log") {
      await processLog(job.data);
    }
  },
  {
    connection: {
      url: process.env.REDIS_URL,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      connectTimeout: 10000,
      tls: {},
    },
  }
);

// events
worker.on("completed", (job) => {
  logger.info({ jobId: job.id }, `Job completed`);
});
worker.on("failed", (job, err) => {
  logger.error({ jobId: job?.id, err }, `Job failed`);
});

// graceful shutdown

//What happens without (shutdown)?
// If you press Ctrl+C, stop your server, or Render/Vercel/Docker sends a kill signal, Node just exits immediately.
// That causes a few annoying problems:
// A job might be halfway processed → stuck or lost
// Redis connection stays open → leaks / phantom locks
// Worker might reprocess the same job on restart → duplicates
// MongoDB connection closes abruptly → errors on next startup

const shutdown = async () => {
  logger.info("Shutting down worker...");
  try {
    await worker.close(); // stop processing new jobs
    await mongoose.disconnect();
    logger.info("Shutdown complete");
    process.exit(0);
  } catch (e) {
    logger.error("Error during shutdown", e);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
