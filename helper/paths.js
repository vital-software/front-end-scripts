/*
    Get CLI arguments, and use local 'test' directory if --test is set
 */
const CLI_ARGUMENTS = process.argv.slice(2)
const TEST_MODE = CLI_ARGUMENTS.includes('--test')

const fs = require('fs')
const path = require('path')
const appDirectory = fs.realpathSync(process.cwd())

function resolveApp(relativePath) {
    const relative = TEST_MODE ? `test/${relativePath}` : relativePath

    return path.resolve(appDirectory, relative)
}

module.exports = {
    appBuild: resolveApp('public'),
    appConfig: resolveApp('.build.config.js'),
    appCss: resolveApp('app/sass'),
    appHtmlTemplate: resolveApp('static/index.html'),
    appIndexJs: resolveApp('app/index.js'),
    appPackageJson: resolveApp('package.json'),
    appPublic: resolveApp('static'),
    appSourceMaps: resolveApp('sourcemap'),
    appSrc: resolveApp('app'),
    ownNodeModules: path.resolve(__dirname, '../node_modules'),
    ownPostCssConfig: path.resolve(__dirname, '../postcss.config.js')
}
