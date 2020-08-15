import * as customENV from 'custom-env'
import * as glob from 'glob'
import { Conf } from './compiler/types'

/**
 * Get and load the conf file, for the environment
 */
customENV.env(process.env.NODE_ENV)

/**
 * Destructure constants from the process.env
 */
const {
  APP_TITLE = '',
  APP_DESCRIPTION = '',
  APP_HOST = '',
  APP_PORT = '',
  APP_VERSION = '',
  APP_DEBUG_MODE = '',
  SECURE_SSL = '',
  SECURE_PRIVATE_KEY = '',
  SECURE_CERTIFICATE = '',
  LIVE_RELOAD = '',
  ASSETS = '',
} = process.env

const conf: Conf = {
  
  // Application 
  app: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    port: Number(APP_PORT),
    host: APP_HOST,
    version: APP_VERSION,
    debugMode: APP_DEBUG_MODE === 'true',
  },

  // SSL
  secure: {
    ssl: SECURE_SSL === 'true',
    privateKey: SECURE_PRIVATE_KEY,
    certificate: SECURE_CERTIFICATE
  },

  // Live reload
  livereload: LIVE_RELOAD === 'true',

  // Assets
  assets: ASSETS.split(',').map((asset: string) => process.env[`ASSETS_${asset}`]) || []
}

export default conf
