const chalk = require('chalk')
const execSync = require('child_process').execSync
const path = require('path')

let execOptions = {
    encoding: 'utf8',
    stdio: [
        'pipe', // stdin (default)
        'pipe', // stdout (default)
        'ignore' // stderr
    ]
}

function isProcessAReactApp(processCommand) {
    return (/^node .*vitalizer\/scripts\/start\.js\s?$/).test(processCommand)
}

function getProcessIdOnPort(port) {
    return execSync(`lsof -i:${port} -P -t -sTCP:LISTEN`, execOptions).trim()
}

function getPackageNameInDirectory(directory) {
    let packagePath = path.join(directory.trim(), 'package.json')

    try {
        return require(packagePath).name
    } catch (e) {
        return null
    }
}

function getProcessCommand(processId, processDirectory) {
    let command = execSync(`ps -o command -p ${processId} | sed -n 2p`, execOptions)

    if (isProcessAReactApp(command)) {
        const packageName = getPackageNameInDirectory(processDirectory)

        return packageName ? `${packageName}\n` : command
    }

    return command
}

function getDirectoryOfProcessById(processId) {
    return execSync(`lsof -p ${processId} | grep cwd | awk '{print $9}'`, execOptions).trim()
}

function getProcessForPort(port) {
    try {
        let command, directory, processId

        processId = getProcessIdOnPort(port)
        directory = getDirectoryOfProcessById(processId)
        command = getProcessCommand(processId, directory)

        return chalk.cyan(command) + chalk.blue('  in ') + chalk.cyan(directory)
    } catch (e) {
        return null
    }
}

module.exports = getProcessForPort
