import { GrantServer, GruntConfig } from './server'
import fs from 'fs'
import path from 'path'
import { FileWatcher } from './watcher'
import commander from 'commander'
/**
 * Entry point for the application
 *
 * @export
 * @param {string[]} args
 * @param {Command} program
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

  const watcher = new FileWatcher()
  watcher.start(program.config, async () => {
    console.log('reloading configuration')
    await server.stop()
    await server.start(loadConfig(program.config))
  })
}

function loadConfig(filePath: string): GruntConfig {
  return JSON.parse(fs.readFileSync(filePath).toString())
}

function normalizeDebugFlag(debug: string | boolean): boolean | string {
  let result: boolean | string = false

  if (debug === true) {
    result = 'res,json'
  } else if (debug) {
    result = debug
  }

  return result
}

function normalizeProxyFlag(proxy: boolean | string): boolean | string {
  if (proxy) {
    if (proxy === 'false') {
      proxy = false
    }
  }

  return proxy
}
