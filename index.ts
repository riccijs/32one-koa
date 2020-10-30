import conf from './src/conf/conf'
import KoaLib from './src/lib/koa'
import chalk from 'chalk'
import https from 'https'
import koaBody from 'koa-body'
import koa from 'koa'
export { default as log } from './src/lib/log'
export { default as conf } from './src/conf/conf'

const kao = new KoaLib()

class Koa {
  public init = async () => {
    try {
      const appInitialization = await kao.init()

      if (!appInitialization) throw Error ('Application failed to initialize')

      const { app } = appInitialization
      
      const { host, port, title } = conf.app
      const SERVER_URI = `http://${host}:${port}`

      /**
       * Report application running
       */
      console.log('---------------------------------------------------------')
      console.log(chalk.green(title))
      console.log(chalk.green(`Environment:         ${process.env.NODE_ENV}`))
      console.log(chalk.green(`Server:              ${SERVER_URI}`))
      console.log('---------------------------------------------------------')

      await app.listen(port)
    } catch (error) {
      console.log(chalk.red('FAILED TO COMPILE', error))
    }
  } 
}

export default new Koa()