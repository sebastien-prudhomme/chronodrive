// Winston
const winston = require('winston')
const { consoleFormat } = require('winston-console-format')

// Init Winston
function initWinston () {
  winston.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.ms(),
      winston.format.colorize(),
      winston.format.padLevels(),
      consoleFormat({ inspectOptions: { colors: true, sorted: true } })
    )
  }))
}

module.exports.initWinston = initWinston
