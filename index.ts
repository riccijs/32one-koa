import conf from './src/conf/conf'
import KoaLib from './src/lib/koa'
import chalk from 'chalk'
export { default as log } from './src/lib/log'
export { default as conf } from './src/conf/conf'

const kao = new KoaLib()

class Koa {
  public init = async () => {
    try {
      const app = await kao.init()
      const SERVER_URI = `${conf.app.protocol}://${conf.app.host}:${conf.app.port}`

      /**
       * Report application running
       */
      console.log('---------------------------------------------------------')
      console.log(chalk.green(conf.app.title))
      console.log(chalk.green(`Environment:         ${process.env.NODE_ENV}`))
      console.log(chalk.green(`Server:              ${SERVER_URI}`))
      console.log('---------------------------------------------------------')

      await app.listen(conf.app.port, conf.app.host)
    } catch (error) {
      console.log(chalk.redBright('FAILED TO COMPILE', error))
    }
  } 
}

export default new Koa()