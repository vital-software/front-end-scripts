const chalk = require('chalk')
const detect = require('detect-port-alt')

const clearConsole = require('../helper/clear-console')

const isInteractive = process.stdout.isTTY

function choosePort(host, defaultPort) {
    return detect(defaultPort, host).then(
        (port) =>
            new Promise((resolve) => {
                if (port === defaultPort) {
                    return resolve(port)
                }
                const message =
                    process.platform !== 'win32' && defaultPort < 1024 && !isRoot()
                        ? 'Admin permissions are required to run a server on a port below 1024.'
                        : `Something is already running on port ${defaultPort}.`

                if (isInteractive) {
                    clearConsole()
                    const existingProcess = getProcessForPort(defaultPort)
                    const question = {
                        type: 'confirm',
                        name: 'shouldChangePort',
                        message: `${chalk.yellow(
                            `${message}${existingProcess ? ` Probably:\n  ${existingProcess}` : ''}`
                        )}\n\nWould you like to run the app on another port instead?`,
                        default: true
                    }

                    inquirer.prompt(question).then((answer) => {
                        if (answer.shouldChangePort) {
                            resolve(port)
                        } else {
                            resolve(null)
                        }
                    })
                } else {
                    console.log(chalk.red(message))
                    resolve(null)
                }
            }),
        (error) => {
            throw new Error(
                `${chalk.red(`Could not find an open port at ${chalk.bold(host)}.`)}\n${`Network error message: ${
                    error.message
                }` || error}\n`
            )
        }
    )
}

function createCompiler(webpack, config, appName) {
    // "Compiler" is a low-level interface to Webpack.
    // It lets us listen to some events and provide our own custom messages.
    let compiler

    try {
        compiler = webpack(config)
    } catch (err) {
        console.log(chalk.red('Failed to compile.'))
        console.log()
        console.log(err.message || err)
        console.log()
        process.exit(1)
    }

    // "invalid" event fires when you have changed a file, and Webpack is
    // recompiling a bundle. WebpackDevServer takes care to pause serving the
    // bundle, so if you refresh, it'll wait instead of serving the old one.
    // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
    compiler.hooks.invalid.tap('invalid', () => {
        if (isInteractive) {
            clearConsole()
        }
        console.log('Compiling...')
    })

    let isFirstCompile = true

    // "done" event fires when Webpack has finished recompiling the bundle.
    // Whether or not you have warnings or errors, you will get this event.
    compiler.hooks.done.tap('done', (stats) => {
        if (isInteractive) {
            clearConsole()
        }

        const messages = stats.toJson('minimal', true)
        const isSuccessful = !messages.errors.length && !messages.warnings.length

        // if (isSuccessful) {
        //     console.log(chalk.green(new Date().toUTCString(), ': Compiled successfully!'));
        // }

        // We have switched off the default Webpack output in WebpackDevServer
        // options so we are going to "massage" the warnings and errors and present
        // them in a readable focused way.
        // console.log(stats.toJson({}, true));

        // const messages = formatWebpackMessages(stats.toJson({}, true));
        // const isSuccessful = !messages.errors.length && !messages.warnings.length;

        if (isSuccessful) {
            console.log(chalk.green('Compiled successfully!'))
        }

        if (isSuccessful && (isInteractive || isFirstCompile)) {
            console.log(chalk.green('TODO'))
        }
        isFirstCompile = false

        // If errors exist, only show errors.
        if (messages.errors.length) {
            // Only keep the first error. Others are often indicative
            // of the same problem, but confuse the reader with noise.
            if (messages.errors.length > 1) {
                messages.errors.length = 1
            }
            console.log(chalk.red('Failed to compile.\n'))
            console.log(messages.errors.join('\n\n'))

            return
        }

        // Show warnings if no errors were found.
        if (messages.warnings.length) {
            console.log(chalk.yellow('Compiled with warnings.\n'))
            console.log(messages.warnings.join('\n\n'))

            // Teach some ESLint tricks.
            console.log(
                `\nSearch for the ${chalk.underline(chalk.yellow('keywords'))} to learn more about each warning.`
            )
            console.log(`To ignore, add ${chalk.cyan('// eslint-disable-next-line')} to the line before.\n`)
        }
    })

    return compiler
}

module.exports = {
    choosePort,
    createCompiler
}
