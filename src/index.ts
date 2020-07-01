#!/usr/bin/env node

import { main } from './main'
import commander from 'commander'
import chalk from 'chalk'

process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)

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
  process.exit(1)
}

main(process.argv, new commander.Command())
