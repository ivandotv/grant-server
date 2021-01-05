import { GrantServer } from './server'
import * as watcher from 'chokidar'
import fs from 'fs'
import path from 'path'
import commander from 'commander'
import { GrantConfig } from 'grant'

/**
 * Entry point for the application
 *
 * @param args  program arguments
 * @param program program instance
 */
export function main(args: string[], program: commander.Command): void {
  program
    .version(__VERSION__)
    .option(
      '-d, --debug [debug-options]',
      'Print server requests and responses as json'
    )
    .option(
      '-c, --config <path>',
      'Path to the configuration file',
      './config.json'
    )
    .option(
      '-p, --trust-proxy [proxy-options]',
      'Expressjs trust proxy options'
    )

  program.parse(args)

  program.debug = normalizeDebugFlag(program.debug)

  program.trustProxy = normalizeProxyFlag(program.trustProxy)

  program.config = path.isAbsolute(program.config)
    ? program.config
    : path.resolve(program.config)

  const config = loadConfig(program.config)

  const server = new GrantServer(program.trustProxy, program.debug)
  server.start(config)

  watcher
    .watch(program.config, {
      persistent: true
    })
    .on('ready', () => {
      console.log(`watching file for changes: ${program.config}`)
    })
    .on('change', async () => {
      console.log('reloading configuration')
      await server.stop()
      await server.start(loadConfig(program.config))
    })
}

/**
 * Load and parse configuration file
 * @param filePath  path to file
 * @returns GrantConfig
 */
function loadConfig(filePath: string): GrantConfig {
  return JSON.parse(fs.readFileSync(filePath).toString())
}

/**
 * Normalize debug flag
 * @param debug passed in debug flag
 * @returns normalized debug flag
 */
function normalizeDebugFlag(debug: string | boolean): boolean | string {
  let result: boolean | string = false

  if (debug === true) {
    result = 'res,json'
  } else if (debug) {
    result = debug
  }

  return result
}

/**
 * Normalize proxy flag
 * @param proxy passed in proxy flag
 * @returns normalized proxy flag
 */
function normalizeProxyFlag(proxy: boolean | string): boolean | string {
  if (proxy) {
    if (proxy === 'false') {
      proxy = false
    }
  } else {
    proxy = true
  }

  return proxy
}
