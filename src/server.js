let express = require('express')
let session = require('express-session')
let grant = require('grant').express()

function startServer(port,sessionSecret,configuration,cb){
    console.log(`port ${port} secret ${sessionSecret} config ${configuration}`)

    const server = express()
        .use(session({secret: sessionSecret, saveUninitialized: true, resave: false}))
        .use(grant(configuration))
        .listen(port,() => {
            console.log(`grant server started on port ${port}`)
            if(cb){
                cb(server)
            }
        })
}

function stopServer(server,cb){
    server.close(cb)
}

module.exports.startServer = startServer
module.exports.stopServer = stopServer
