// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

/*
    Makes the script crash on unhandled rejections instead of silently
    ignoring them. In the future, promise rejections that are not handled will
    terminate the Node.js process with a non-zero exit code.
 */
process.on('unhandledRejection', (error) => {
    throw error
})

const chalk = require('chalk')
const serve = require('webpack-serve')
const paths = require('../config/paths')
const config = require('../config/serve.config.js')
const { checkBrowsers } = require('../helper/browsers')
const checkRequiredFiles = require('../helper/check-required-files')

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
    process.exit(1)
}

// Locate HOST/PORT
const PORT = parseInt(process.env.PORT, 10) || 3000
const HOST = process.env.HOST || '0.0.0.0'

if (process.env.HOST) {
    console.log(
        chalk.cyan(`Attempting to bind to HOST environment variable: ${chalk.yellow(chalk.bold(process.env.HOST))}`)
    )
    console.log('If this was unintentional, check that you haven\'t mistakenly set it in your shell.')
    console.log()
}

checkBrowsers(paths.appPath)
    // We attempt to use the default port but if it is busy, we offer the user to
    // run on a different port. `choosePort()` Promise resolves to the next free port.
    .then(() => {
        serve(config(HOST, PORT))
    })
    .catch((error) => {
        if (error && error.message) {
            console.log(error.message)
        }

        process.exit(1)
    })
