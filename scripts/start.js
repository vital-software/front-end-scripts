/* eslint-disable no-console */

const chalk = require('chalk')
const clearConsole = require('../helper/clear-console')
const detect = require('detect-port')
const getProcessForPort = require('../helper/get-process-for-port')
const options = require('../webpack.config.babel.js')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const WEBPACK_OPTIONS = {
    dev: true,
    shortName: true
}

const IS_INTERACTIVE = process.stdout.isTTY
const DEFAULTS = {
    HOST: options.defaults.host,
    PORT: options.defaults.port,
    PROTOCOL: options.defaults.protocol
}

function run() {
    let isFirstCompile = true

    const config = options.webpack(WEBPACK_OPTIONS)

    const compiler = webpack(config)
    const devServer = new WebpackDevServer(compiler, config.devServer)

    const showInstructions = IS_INTERACTIVE || isFirstCompile

    if (showInstructions) {
        console.log()
        console.log('The app is running at:')
        console.log()
        console.log('  ', chalk.cyan(`${DEFAULTS.PROTOCOL}://${DEFAULTS.HOST}:${DEFAULTS.PORT}/`))
        console.log()
        console.log('Note that the development build is not optimized.')
        console.log('To create a production build, use', chalk.cyan('yarn build'), '.')
        console.log()

        isFirstCompile = false
    }

    compiler.hooks.invalid.tap('invalid', () => {
        if (IS_INTERACTIVE) {
            clearConsole()
        }

        console.log('')
        console.log(chalk.blue(new Date().toUTCString(), ': Compiling...'))
    })

    compiler.hooks.done.tap('done', (stats) => {
        if (IS_INTERACTIVE) {
            // clearConsole();
        }

        // We have switched off the default Webpack output in WebpackDevServer
        // options so we are going to "massage" the warnings and errors and present
        // them in a readable focused way.
        const messages = stats.toJson('minimal', true)
        const isSuccessful = !messages.errors.length && !messages.warnings.length

        if (isSuccessful) {
            console.log(chalk.green(new Date().toUTCString(), ': Compiled successfully!'))
        }

        // If errors exist, only show errors.
        if (messages.errors.length) {
            console.log(chalk.red(new Date().toUTCString(), ': Failed to compile.'))
            console.log()
            messages.errors.forEach((message) => {
                console.log(message)
                console.log()
            })

            return
        }

        // Show warnings if no errors were found.
        if (messages.warnings.length) {
            console.log(chalk.yellow('Compiled with warnings.'))
            console.log()
            messages.warnings.forEach((message) => {
                console.log(message)
                console.log()
            })

            // Teach some ESLint tricks.
            console.log('You may use special comments to disable some warnings.')
            console.log('Use', chalk.yellow('// eslint-disable-next-line'), 'to ignore the next line.')
            console.log('Use', chalk.yellow('/* eslint-disable */'), 'to ignore all warnings in a file.')
        }
    })

    // Launch WebpackDevServer
    devServer.listen(DEFAULTS.PORT, DEFAULTS.HOST, (error) => {
        if (error) {
            return console.log(error)
        }

        console.log(chalk.cyan('Starting the development server...'))
        console.log()
    })
}

// We attempt to use the default port but if it is busy, we let the user know the exisitng process
detect(DEFAULTS.PORT).then((port) => {
    if (port === DEFAULTS.PORT) {
        run()

        return
    }

    if (IS_INTERACTIVE) {
        clearConsole()
    }

    console.log(chalk.red(`Something is already running on port ${DEFAULTS.PORT}.`))

    if (IS_INTERACTIVE) {
        let existingProcess = getProcessForPort(DEFAULTS.PORT)

        if (existingProcess) {
            console.log(chalk.red(`Probably:\n ${existingProcess}`))
            console.log(chalk.red('Try clearing any processes running on that port and running the command again.'))
        }
    }
})
