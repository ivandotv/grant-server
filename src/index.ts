// const main = require('./main')
import { main } from './main'
import commander from 'commander'
import chalk from 'chalk'

process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)

function handleError(e: any): void {
  if (typeof e.message !== 'undefined') {
    console.log(chalk.bold.red(`Error ${e.message}`))
  } else {
    console.log(e)
  }
  process.exit(1)
}

main(process.argv, new commander.Command())
