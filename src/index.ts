#!/usr/bin/env node

import { main } from './main'
import commander from 'commander'
import chalk from 'chalk'
import { GrantServer } from './server'

process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)

process.on('SIGINT', () => {
  gracefulShutdown(0, server)
})
process.on('SIGTERM', () => {
  gracefulShutdown(0, server)
})

process.on('SIGHUP', () => {
  gracefulShutdown(0, server)
})

/**
 * Handle program error
 *
 * @param e program error
 */
function handleError(e: any): void {
  if (typeof e.message !== 'undefined') {
    console.error(chalk.bold.red(`Error ${e.message}`))
  } else {
    console.error(e)
  }

  gracefulShutdown(1, server)
}
/**
 * Graceful shutdown of the server
 * @param code - Exit code
 * @param server - Server referece
 * @param timeout - How long to wait for graceful shutdown
 */
function gracefulShutdown(
  code: number,
  server?: GrantServer,
  timeout = 4000
): void {
  if (server) {
    server.stop().finally(() => {
      console.log('server stopped')
      process.exit(code)
    })

    setTimeout(() => {
      console.error(
        chalk.bold.red(
          `Error: could not close the server after ${timeout}ms. Doing forced shutdown`
        )
      )
      process.exit(code)
    }, timeout)
  } else {
    process.exit(code)
  }
}

// init app
const server = main(process.argv, new commander.Command())
