const browserslist = require('browserslist')
const chalk = require('chalk')
const colours = require('../config/colours')

function checkBrowsers(dir, retry = true) {
    const browsers = browserslist.findConfig(dir)

    if (browsers) {
        const browsersList = browsers[process.env.NODE_ENV] || browsers.defaults
        const output = Array.isArray(browsersList) ? browsersList.join(', ') : browsersList
        return Promise.resolve(`${chalk.hex(colours.text)(output)}.`)
    }

    if (!retry) {
        return Promise.reject(
            new Error(chalk.hex(colours.error)(`Please add a ${chalk.bold('.browserslistrc')} file to the project.`))
        )
    }

    return checkBrowsers(dir, false)
}

module.exports = checkBrowsers
