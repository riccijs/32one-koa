import conf from '../conf/conf'
import winston from 'winston'

/************************************************
 * Logger
 ************************************************/
const log = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: conf.app.title },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})
if (conf.app.debugMode) {
  log.add(new winston.transports.Console({
    format: winston.format.simple(),
  }))
}

export default log