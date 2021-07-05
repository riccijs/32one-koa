import conf from './src/conf/conf'
import KoaLib from './src/lib/koa'
import chalk from 'chalk'
import https from 'https'
import IO from 'koa-socket-2'
export { default as log } from './src/lib/log'
export { default as conf } from './src/conf/conf'

const kao = new KoaLib()

class Koa {
  public init = async () => {
    try {
      const appInitialization = await kao.init()

      if (!appInitialization) throw Error ('Application failed to initialize')

      const { app, credentials } = appInitialization
      const { protocol, hostname, port, title } = conf.app
      const SERVER_URI = `${protocol}://${hostname}:${port}`
      
      /**
       * Report application running
       */
      console.log('---------------------------------------------------------')
      console.log(chalk.green(title))
      console.log(chalk.green(`Environment:         ${process.env.NODE_ENV}`))
      console.log(chalk.green(`Server:              ${SERVER_URI}`))
      console.log('---------------------------------------------------------')
      
      
      if (protocol === 'https') {
        const server = await https.createServer(credentials, app.callback())
        new IO(server)
        await server.listen(port)
      }
      else {
        const io = new IO()
        io.attach( app )
        await app.listen(port, hostname)
      }
    } catch (error) {
      console.log(chalk.red('FAILED TO COMPILE', error))
    }
  } 
}

export default new Koa()