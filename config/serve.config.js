// Load in ENV values
require('./env')

const config = require('./webpack.config.dev')
const convert = require('koa-connect')
const history = require('connect-history-api-fallback')
const paths = require('./paths')
const proxy = require('http-proxy-middleware')
const Router = require('koa-router')

// Proxy options
const proxyOptions = {
    headers: {
        host: process.env.API_PROXY_HOST
    },
    pathRewrite: { ['^/api']: '' },
    secure: false,
    target: process.env.API_PROXY_URL
}

// Create router definition
const router = new Router()

// Emulate healthcheck like nginx
router.get('/healthcheck', (ctx) => {
    ctx.body = {
        org: 'vital',
        service: 'vitalizer'
    }
})

// Set up API proxy
router.use('/api', convert(proxy(proxyOptions)))

// History fallback (this needs to be declared before middleware)
router.get('*', convert(history()))

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

        // Router needs to be added first.
        app.use(router.routes())

        // since we're manipulating the order of middleware added, we need to handle
        // adding these two internal middleware functions.
        middleware.webpack()
        middleware.content()
    }
})
