//We are using pino and pino-pretty for logging instead of using normal console.log

const pino = require("pino");
require('dotenv').config();

const logger = pino({
  level : process.env.LOG_LEVEL || 'info', // this is to restrict your console to print only those type of logs you wanna see 
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

module.exports = logger;
