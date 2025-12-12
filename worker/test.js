require("dotenv").config();

const IORedis = require("ioredis");

console.log("Connecting to Redis...");

const redis = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  connectTimeout: 5000,
  tls: {
    rejectUnauthorized: false,
  },
});

redis.on("connect", () => {
  console.log("Connected!");
});

redis.on("ready", () => {
  console.log("Ready!");
});

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});

redis
  .ping()
  .then((res) => {
    console.log("PING Response:", res);
    process.exit(0);
  })
  .catch((err) => {
    console.error("PING Failed:", err);
    process.exit(1);
  });
