import conf from '../conf/conf'
import koa from 'koa'
import logger from 'koa-logger'
import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import glob from 'glob'
import bodyParser from 'koa-body'
import log from './log'
import stripAnsi from 'strip-ansi'
import cors from '@koa/cors'

export default class Express {
  /**
   * Init
   */
  public init() {
    const app = new koa()
    this.initSSLValidation()
    this.initMiddleware(app)
    this.initModulesConfiguration(app)

    return app
  }
  
  /**
   * Validate certs exit (if secure.ssl)
   */
  private initSSLValidation() {
    if (!conf.secure.ssl) return true
    const privateKey = fs.existsSync(path.resolve(conf.secure.privateKey))
    const certificate = fs.existsSync(path.resolve(conf.secure.certificate))
  
    if (!privateKey || !certificate) {
      console.log('---------------------------------------------------------')
      console.log(chalk.yellow('+ Warning: Certificate file or key file is missing, falling back to non-SSL mode'))
      console.log(chalk.yellow(`+ MISSING: ${conf.secure.privateKey} AND/OR ${conf.secure.certificate}`))
      conf.secure.ssl = false
    }
  }
  
  /**
   * Initialize application middleware
   */
  private initMiddleware(app) {
    
    app.use(bodyParser({
      formidable:{uploadDir: './uploads'},
      multipart: true,
      urlencoded: true
    }))

    /**
     * Init logger
     */
    app.use(logger(str => {
      log.defaultMeta = { ...log.defaultMeta, timestamp: new Date()},
      log.info(stripAnsi(str))
      app.on('error', err => {
        log.defaultMeta = { ...log.defaultMeta, error: err.toString() },
        log.error(stripAnsi(str))
      })
    }))

    /**
     * Error handling
     */
    app.use(async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        const { _message, message, response, status } = err
        const { status: resStatus, data } = response || { status: 400, data: 'Bad Request' }
        ctx.response.status = status || resStatus
        ctx.response.body = _message || message || data
        ctx.app.emit('error', err, ctx)
      }
   })

    app.use(cors())
  }
  
  /**
    * Invoke modules server configuration
    */
  private initModulesConfiguration(app) {
    const assets: Array<Array<string>> = conf.assets.map((asset: string | undefined) => glob.sync(asset))
    console.log('---------------------------------------------------------')
    assets.forEach(asset => {
      asset.forEach((assetPath) => {
        console.log(chalk.green(`+ ADDED - Asset: ${assetPath}`))
        import (path.join(process.cwd(), assetPath)).then(module => {
          if (!!module.default) {
            module.default(app)
          }
        })
      })
    })
  }
}