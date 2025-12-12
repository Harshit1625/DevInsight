//In this file , we will be mainly instantiating the redis and connecting it to bullMQ so that logs get added to the queue.

require("dotenv").config();
const { Queue } = require("bullmq");

const logsQueue = new Queue(process.env.QUEUE_NAME || "logs", {
  connection: {
    url: process.env.REDIS_URL,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    connectTimeout: 10000,
    tls: {},
  },
});

module.exports = { logsQueue };
