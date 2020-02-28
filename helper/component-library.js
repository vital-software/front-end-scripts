const chalk = require('chalk')
const fs = require('fs')
const paths = require('../config/paths')

// Print out if the Component Library exists
function printComponentLibrary() {
    const hasComponentLibrary = fs.existsSync(paths.appComponentLibrary)

    if (hasComponentLibrary) {
        console.log(chalk.magenta('Vital Component Library detected and transpiling!'))
    } else {
        console.log(chalk.red('Component Library not detected!'))
    }
}

module.exports = { printComponentLibrary }