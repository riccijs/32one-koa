import * as customENV from 'custom-env'
import * as glob from 'glob'
import { Conf } from './compiler/types'

/**
 * Get and load the conf file, for the environment
 */
customENV.env(process.env.NODE_ENV, 'secret')

/**
 * Destructure constants from the process.env
 */
const {
  APP_TITLE = '',
  APP_DESCRIPTION = '',
  APP_HOSTNAME = '127.0.0.1',
  APP_PORT = '8000',
  APP_PROTOCOL = 'http',
  APP_VERSION = '',
  APP_DEBUG_MODE = 'true',
  SECURE_ALLOW_ORIGIN = '',
  SECURE_SSL = '',
  SECURE_PRIVATE_KEY = '',
  SECURE_CERTIFICATE = '',
  LIVE_RELOAD = 'true',
  ASSETS = '',
} = process.env

const conf: Conf = {
  
  // Application 
  app: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    port: Number(APP_PORT),
    hostname: APP_HOSTNAME,
    protocol: APP_PROTOCOL,
    version: APP_VERSION,
    debugMode: APP_DEBUG_MODE === 'true',
  },

  // SSL
  secure: {
    ssl: SECURE_SSL === 'true',
    privateKey: SECURE_PRIVATE_KEY,
    certificate: SECURE_CERTIFICATE,
    allowOrigin: SECURE_ALLOW_ORIGIN.split(',') || [ SECURE_ALLOW_ORIGIN || ''],
  },

  // Live reload
  livereload: LIVE_RELOAD === 'true',

  // Assets
  assets: ASSETS.split(',').map((asset: string) => process.env[`ASSETS_${asset}`]) || []
}

export default conf
