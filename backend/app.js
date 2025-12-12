const express = require('express');
const app = express();
const cors = require('cors');
const logsRouter = require('./routes/logs')
const WebSocketRouter = require('./routes/websocket')

app.use(cors());
app.use(express.json());

app.use("/api/logs" , logsRouter);
app.use('/api/ws' , WebSocketRouter);
app.get("/" , (req , res) => res.send("DevInsight Backend"))

module.exports = app;