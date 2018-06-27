const config = require('./webpack.config.dev')
const paths = require('./paths')

/*
    This is the webpack-serve configuration.
 */
module.exports = (host, port) => ({
    // An object containing the configuration for creating a new webpack compiler instance.
    config,

    // The path, or array of paths, from which static content will be served.
    content: paths.appPublic,

    // Sets the host that the server will listen on.
    host,

    // The port the server should listen on.
    port
})
