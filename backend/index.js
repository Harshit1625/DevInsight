const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const app = require("./app");
const logger = require("./utils/logger");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  logger.info("MongoDB connected");

  // create http server and socket.io ! Connecting both so that they run on same port
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN || "*",
      methods: ["GET", "POST"],
    },
  });

  // expose io to express routes / other modules
  app.set("io", io);

  io.on("connection", (socket) => {
    logger.info("Client connected to socket", { id: socket.id });
    socket.on("disconnect", () =>
      logger.info("Socket disconnected", { id: socket.id })
    );
  });

  server.listen(PORT, () => {
    logger.info(`Backend listening on port ${PORT}`);
  });
}

start().catch((e) => {
  logger.error("Startup error", e);
  process.exit(1);
});
