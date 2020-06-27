const {startServer,stopServer} = require('./server')
const packageJson = require('../package.json')
// const chalk = require('chalk')
const watcher = require('chokidar')
const fs = require('fs')
const path = require('path')

/**
 * Entry point for the application
 *
 * @export
 * @param {string[]} args
 * @param {Command} program
 */
function main(args, program) {
    program
        .version(packageJson.version)
        .option('-d, --debug [debug-options]', 'Print server requests and responses as json')
        .option('-c, --config <path>','Path to the configuration file','./config.json')

    program.parse(args)

    //flag is passed but no debug-options, set defaults
    if(program.debug === true){
        program.debug = 'res,json'
    }

    console.log(`debug ${program.debug}`)


    if(program.debug){
        process.env.DEBUG = program.debug
    }

    console.log(`ENV ${process.env.DEBUG}`)

    // if(!args.config){
    //     args.config = './config.json'
    // }

    //todo - setup configuration
    console.log(`config ${program.config}`)

    const configPath = path.resolve(__dirname,program.config)

    const config = getConfig(configPath)
    let port = findPort(config)

    const sessionSecret = Math.random() * 100

    startServer(port,sessionSecret.toString(),config,(server) => {
        //start watching for config file changes

        let serverRunning = true
        let shouldReload = false
        watcher.watch(configPath, {
            persistent: true
        }).on('ready',() => {
            console.log('--------------- watching for changes')
        }).on('change',() => {
            console.log('configuration file changed ')
            console.log('restarting server ')
            // restartServer(server,configPath,sessionSecret)
            if(serverRunning){
                stopServer(server,() => {
                    serverRunning=false
                    // server is stopped start it again
                    const config = getConfig(configPath)
                    let port = findPort(config)
                    startServer(port,sessionSecret,config,() => {
                        console.log('server restarted')

                        serverRunning = true
                        if(shouldReload){
                            // we need another reload
                            console.log('we need another reload')
                            shouldReload=false
                            const config = getConfig(configPath)
                            let port = findPort(config)
                            startServer(port,config,() => {
                                serverRunning=true
                                console.log('Server late reload')

                            }
                            )

                        }
                    }
                    )
                })
            }else{
                shouldReload=true
            }
        })

    }
    )
}


function findPort(config,defaultPort= 3000){
    let port
    try {
        port = config.defaults.origin.split(':')[2]
    }
    catch(e){
        port = defaultPort
    }
    return port
}
function getConfig(configPath){

    return JSON.parse(fs.readFileSync(configPath))
}

// function restartServer(server,configPath,sessionSecret){
//     stopServer(server,() => {

//         startServer()
//     }
//     )
// }

module.exports = main
