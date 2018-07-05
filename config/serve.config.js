// Load in ENV values
require('./env')

const config = require('./webpack.config.dev')
const convert = require('koa-connect')
const history = require('connect-history-api-fallback')
const paths = require('./paths')
const proxy = require('http-proxy-middleware')

/*
    This is the webpack-serve configuration.
 */
module.exports = (host, port) => ({
    // If true, the server will copy the server URI to the clipboard when the server is started.
    clipboard: false,

    // An object containing the configuration for creating a new webpack compiler instance.
    config,

    // The path, or array of paths, from which static content will be served.
    content: paths.appPublic,

    // Sets the host that the server will listen on.
    host,

    // Hot Module Replacement settings.
    hot: {
        // Enable HMR.
        hmr: true,

        // Don't automatically reload the page if HMR fails.
        // Opinionated setting, we can remove this when we are
        // happy with how HMR operates in our stack.
        reload: false
    },

    // The port the server should listen on.
    port,

    // WebpackDevMiddleware configuration.
    dev: {
        // Turn off default stats output as we are using StylishWebpackPlugin to format output.
        stats: false
    },

    add: (app, middleware) => {
        // Just a note, the order of statements matters here.

        // Emulate healthcheck like nginx
        app.get('/healthcheck', (request, response) => {
            response.json({
                org: 'vital',
                service: 'vitalizer'
            })
        })

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
