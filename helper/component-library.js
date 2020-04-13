const chalk = require('chalk')
const fs = require('fs')
const paths = require('../config/paths')

// Check if the Component Library exists
function checkComponentLibrary() {
    const hasComponentLibrary = fs.existsSync(paths.appComponentLibrary)

    if (hasComponentLibrary) {
        return Promise.resolve(`${chalk.hex('#2b76bf')('Vital Component Library detected and transpiling!')}.`)
    } else {
        return Promise.reject(new Error(chalk.hex('#d04216')('Component Library not detected!')))
    }
}

module.exports = checkComponentLibrary
