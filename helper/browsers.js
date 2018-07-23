const browserslist = require('browserslist')
const chalk = require('chalk')
const os = require('os')

function checkBrowsers(dir, retry = true) {
    const current = browserslist.findConfig(dir)

    if (current) {
        return Promise.resolve(current)
    }

    if (!retry) {
        return Promise.reject(
            new Error(
                `${chalk.red('You must specify targeted browsers.') + os.EOL}Please add a ${chalk.bold(
                    '.browserslistrc'
                )} file to the project.`
            )
        )
    }

    return checkBrowsers(dir, false)
}

function printBrowsers(dir) {
    return checkBrowsers(dir).then((browsers) => {
        if (browsers === null) {
            console.log('Compiling with default browser support.')

            return
        }

        const browsersList = browsers[process.env.NODE_ENV] || browsers.defaults
        const output = Array.isArray(browsersList) ? browsersList.join(', ') : browsersList

        console.log(`Compiling with browser support for ${chalk.cyan(output)}.`)
    })
}

module.exports = { checkBrowsers, printBrowsers }
