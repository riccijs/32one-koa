export interface Conf {

  // Application 
  app: {
    title: string
    description: string
    port: number
    hostname: string
    protocol: string
    version: string
    debugMode: boolean
  }

  // SSL
  secure: {
    ssl: boolean
    privateKey: string
    certificate: string
    allowOrigin: string[]
  },

  // Live reload
  livereload: boolean

  // Assets
  assets: (string | undefined)[]
}