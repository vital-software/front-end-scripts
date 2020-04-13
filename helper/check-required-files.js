const fs = require('fs')
const chalk = require('chalk')
const path = require('path')

function checkRequiredFiles(files) {
    let currentFilePath

    try {
        files.forEach((filePath) => {
            currentFilePath = filePath
            fs.accessSync(filePath, fs.F_OK)
        })

        return Promise.resolve(`${chalk.hex('#2b76bf')('All required files found')}.`)
    } catch (err) {
        return Promise.reject(
            new Error(
                chalk.hex('#d04216')(
                    `Cannout find file: ${path.dirname(currentFilePath)}/${path.basename(currentFilePath)}`
                )
            )
        )
    }
}

module.exports = checkRequiredFiles
