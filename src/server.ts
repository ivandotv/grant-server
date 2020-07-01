import express from 'express'
import session from 'express-session'
// @ts-ignore
import grant from 'grant'
import { Server } from 'http'

/**
 * Grunt configuration
 */
export interface GrantConfig {
  defaults: {
    origin: string
  }
}

const grantExpress = grant.express()

/**
 * Grant server class
 */
export class GrantServer {
  protected sessionSecret: string

  protected configuration: any

  protected port: number = 3000

  server: Server | undefined

  /**
   * Creates an instance of grant server.
   *
   * @param proxy - should proxy be used
   * @param debug - should debug be used
   */
  constructor(protected proxy: boolean | string, debug: string | boolean) {
    this.sessionSecret = (Math.random() * 100).toString()
    this.proxy = proxy

    if (debug) {
      process.env.DEBUG = debug as string
    }
  }

  /**
   * Starts grant server
   *
   * @param configuration grunt configuration
   * @returns Promise to be resolved when server starts
   */
  start(configuration: GrantConfig): Promise<void> {
    this.configuration = configuration
    this.port = resolvePort(this.configuration)

    return new Promise((resolve) => {
      this.server = express()
        .set('trust proxy', this.proxy)
        .use(
          session({
            secret: this.sessionSecret,
            saveUninitialized: false,
            resave: false
          })
        )
        .use(grantExpress(this.configuration))
        .listen(this.port, () => {
          console.log(`server started on port ${this.port}`)
          resolve()
        })
    })
  }

  /**
   * Stops grant server
   *
   * @returns Promise to be resolved when the server is stopped
   */
  stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server!.close((_error) => {
        resolve()
      })
    })
  }
}

function resolvePort(config: any, defaultPort = 3000): number {
  let port
  try {
    port = config.defaults.origin.split(':')[2]
  } catch (e) {
    port = defaultPort
  }

  return port
}
