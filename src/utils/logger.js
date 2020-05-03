const winston = require('winston')

const config = require('../config')

const logger = winston.createLogger({
  level: config.winston.level,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
})

module.exports = logger
