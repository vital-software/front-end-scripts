process.traceDeprecation = true

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

/*
    Makes the script crash on unhandled rejections instead of silently
    ignoring them. In the future, promise rejections that are not handled will
    terminate the Node.js process with a non-zero exit code.
 */
process.on('unhandledRejection', (error) => {
    throw error
})

const chalk = require('chalk')
const fs = require('fs-extra')
const webpack = require('webpack')
// const bfj = require('bfj')
const config = require('../config/webpack.config.prod')
const paths = require('../config/paths')

// const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
// const printHostingInstructions = require('react-dev-utils/printHostingInstructions')
const FileSizeReporter = require('../helper/file-size-reporter')
// const printBuildError = require('react-dev-utils/printBuildError')
const { checkBrowsers, printBrowsers } = require('../helper/browsers')
const checkRequiredFiles = require('../helper/check-required-files')

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

function copyPublicFolder() {
    fs.copySync(paths.appPublic, paths.appBuild, {
        dereference: true,
        filter: (file) => file !== paths.appHtml
    })
}

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
    process.exit(1)
}

checkBrowsers(paths.appPath)
    .then(() => {
        // First, read the current file sizes in build directory.
        // This lets us display how much they changed later.
        return measureFileSizesBeforeBuild(paths.appBuild)
    })
    .then((previousFileSizes) => {
        // Remove all content but keep the directory so that
        // if you're in it, you don't end up in Trash
        fs.emptyDirSync(paths.appBuild)
        // Merge with the public folder
        copyPublicFolder()

        // Start the webpack build
        return build(previousFileSizes)
    })
    .then(
        ({ stats, previousFileSizes, warnings }) => {
            if (warnings.length) {
                console.log(chalk.yellow('Compiled with warnings.\n'))
                console.log(warnings.join('\n\n'))
                console.log(
                    `\nSearch for the ${chalk.underline(chalk.yellow('keywords'))} to learn more about each warning.`
                )
                console.log(`To ignore, add ${chalk.cyan('// eslint-disable-next-line')} to the line before.\n`)
            } else {
                console.log(chalk.green('Compiled successfully.\n'))
            }

            console.log('File sizes after gzip:\n')
            printFileSizesAfterBuild(
                stats,
                previousFileSizes,
                paths.appBuild,
                WARN_AFTER_BUNDLE_GZIP_SIZE,
                WARN_AFTER_CHUNK_GZIP_SIZE
            )
            console.log()

            printBrowsers(paths.appPath)
        },
        (error) => {
            console.log(chalk.red('Failed to compile.\n'))
            console.log(error)

            process.exit(1)
        }
    )
    .catch((error) => {
        if (error && error.message) {
            console.log(error.message)
        }

        process.exit(1)
    })

// Create the production build
function build(previousFileSizes) {
    console.log('Creating an optimized production build...')

    const compiler = webpack(config)

    return new Promise((resolve, reject) => {
        compiler.run((error, stats) => {
            if (error) {
                return reject(error)
            }

            const messages = stats.toJson({})

            if (messages.errors.length) {
                // Only keep the first error. Others are often indicative
                // of the same problem, but confuse the reader with noise.
                if (messages.errors.length > 1) {
                    messages.errors.length = 1
                }

                return reject(new Error(messages.errors.join('\n\n')))
            }
            if (
                process.env.CI &&
                (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') &&
                messages.warnings.length
            ) {
                console.log(
                    chalk.yellow(
                        '\nTreating warnings as errors because process.env.CI = true.\n' +
                            'Most CI servers set it automatically.\n'
                    )
                )

                return reject(new Error(messages.warnings.join('\n\n')))
            }

            const resolveArgs = {
                stats,
                previousFileSizes,
                warnings: messages.warnings
            }

            return resolve(resolveArgs)
        })
    })
}
