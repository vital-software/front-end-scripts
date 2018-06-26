/* eslint-disable no-console */
process.env.NODE_ENV = 'production'

const WEBPACK_OPTIONS = { dev: false, shortName: false }

const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const filesize = require('filesize')
const gzipSize = require('gzip-size').sync
const webpack = require('webpack')
const config = require('../webpack.config.babel').webpack(WEBPACK_OPTIONS)
const paths = require('../helper/paths')
const recursive = require('recursive-readdir')
const stripAnsi = require('strip-ansi')

// Input: /User/dan/app/build/static/js/main.82be8.js
// Output: /static/js/main.js
function removeFileNameHash(fileName) {
    return fileName.replace(paths.appBuild, '').replace(/\/?(.*)(\.\w+)(\.js|\.css)/, (match, p1, p2, p3) => p1 + p3)
}

// Input: 1024, 2048
// Output: "(+1 KB)"
function getDifferenceLabel(currentSize, previousSize) {
    const FIFTY_KILOBYTES = 1024 * 50 // eslint-disable-line no-magic-numbers
    const difference = currentSize - previousSize
    const fileSize = !Number.isNaN(difference) ? filesize(difference) : 0 // eslint-disable-line

    if (difference >= FIFTY_KILOBYTES) {
        return chalk.red(`+${fileSize}`)
    } else if (difference < FIFTY_KILOBYTES && difference > 0) {
        return chalk.yellow(`+${fileSize}`)
    } else if (difference < 0) {
        return chalk.green(fileSize)
    }

    return ''
}

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
recursive(paths.appBuild, (err, fileNames) => {
    const previousSizeMap = (fileNames || [])
        .filter((fileName) => (/\.(js|css)$/).test(fileName))
        .reduce((memo, fileName) => {
            const contents = fs.readFileSync(fileName)
            const key = removeFileNameHash(fileName)

            memo[key] = gzipSize(contents)

            return memo
        }, {})

    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild)

    // Start the webpack build
    build(previousSizeMap)

    // Merge with the public folder
    copyPublicFolder()
})

// Print a detailed summary of build files.
function printFileSizes(stats, previousSizeMap) {
    const assets = stats
        .toJson()
        .assets.filter((asset) => (/\.(js|css)$/).test(asset.name))
        .map((asset) => {
            const fileContents = fs.readFileSync(`${paths.appBuild}/${asset.name}`)
            const size = gzipSize(fileContents)
            const previousSize = previousSizeMap[removeFileNameHash(asset.name)]
            const difference = getDifferenceLabel(size, previousSize)

            return {
                folder: path.join('public', path.dirname(asset.name)),
                name: path.basename(asset.name),
                size: size,
                sizeLabel: `  ${filesize(size)}${difference ? ` (${difference})` : ''}`
            }
        })

    assets.sort((a, b) => b.size - a.size)

    const longestSizeLabelLength = Math.max.apply(null, assets.map((a) => stripAnsi(a.sizeLabel).length))

    assets.forEach((asset) => {
        let sizeLabel = asset.sizeLabel
        const sizeLength = stripAnsi(sizeLabel).length

        if (sizeLength < longestSizeLabelLength) {
            const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength)

            sizeLabel += rightPadding
        }
        console.log(sizeLabel, chalk.dim(asset.folder + path.sep) + chalk.cyan(asset.name))
    })
}

// Print out errors
function printErrors(summary, errors) {
    console.log(chalk.red(summary))
    console.log()
    errors.forEach((error) => {
        console.log(error.message || error)
        console.log()
    })
}

// Create the production build and print the deployment instructions.
function build(previousSizeMap) {
    const buildMessage = {
        production: 'Creating an optimized production build...',
        development: 'Creating a development build...'
    }

    console.log(buildMessage[config.mode])

    webpack(config).run((error, stats) => {
        if (error) {
            printErrors('Failed to compile.', [error])
            process.exit(1)
        }

        if (stats.compilation.errors.length) {
            printErrors('Failed to compile.', stats.compilation.errors)
            process.exit(1)
        }

        if (process.env.CI && stats.compilation.warnings.length) {
            printErrors('Failed to compile.', stats.compilation.warnings)
            process.exit(1)
        }

        console.log(chalk.green('Compiled successfully.'))
        console.log()

        console.log('File sizes after gzip:')
        printFileSizes(stats, previousSizeMap)
        console.log()

        console.log('The', chalk.cyan('public'), 'folder is ready to be deployed.')
        console.log()
    })
}

function copyPublicFolder() {
    fs.copySync(paths.appPublic, paths.appBuild, {
        dereference: true,
        filter: (file) => file !== paths.appHtml
    })
}
