const chalk = require('chalk')
const fs = require('fs')
const paths = require('../config/paths')
const colours = require('../config/colours')

// Check if the Component Library exists
function checkComponentLibrary() {
    const hasComponentLibrary = fs.existsSync(paths.appComponentLibrary)

    if (hasComponentLibrary) {
        return Promise.resolve(`${chalk.hex(colours.text)('Vital Component Library detected and transpiling!')}.`)
    } else {
        return Promise.reject(new Error(chalk.hex(colours.error)('Component Library not detected!')))
    }
}

module.exports = checkComponentLibrary
