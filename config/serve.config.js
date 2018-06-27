// Load in ENV values
require('./env')

const config = require('./webpack.config.dev')
const paths = require('./paths')

const convert = require('koa-connect')
const history = require('connect-history-api-fallback')
const proxy = require('http-proxy-middleware')

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
    port,

    // WebpackDevMiddleware configuration.
    dev: {
        // Turn off default stats output as we are using StylishWebpackPlugin to format output.
        stats: false
    },

    add: (app, middleware) => {
        // Just a note, the order of statements matters here.

        // Set up API proxy
        app.use(
            convert(
                proxy('/api', {
                    headers: {
                        host: process.env.API_PROXY_HOST
                    },
                    pathRewrite: { ['^/api']: '' },
                    secure: false,
                    target: process.env.API_PROXY_URL
                })
            )
        )

        // History fallback (this needs to be declared before middleware)
        app.use(convert(history()))

        // Ensure webpack files are loaded before static content
        // we need index.js to exist before HtmlWebpackPlugin run on static/index.html
        middleware.webpack()
        middleware.content()
    }
})
