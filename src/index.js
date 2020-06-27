const main = require('./main')
const commander = require( 'commander')
const chalk = require( 'chalk')

main(process.argv, new commander.Command())

process.on('uncaughtException', e => {
    if (typeof e.message !== 'undefined') {
        console.log(chalk.bold.red(e.message))
    } else {
        console.log(e)
    }
    process.exit(1)
})
