const fs = require('fs')
const path = require('path')

const appDirectory = fs.realpathSync(process.cwd())

function resolveApp(relativePath) {
    return path.resolve(appDirectory, relativePath)
}

module.exports = {
    appBuild: resolveApp('public'),
    appConfig: resolveApp('.build.config.js'),
    appCss: resolveApp('app/sass'),
    appHtmlTemplate: resolveApp('static/index.html'),
    appIndexJs: resolveApp('app/index.js'),
    appPackageJson: resolveApp('package.json'),
    appPublic: resolveApp('static'),
    appSrc: resolveApp('app'),
    ownNodeModules: path.resolve(__dirname, '../node_modules'),
    ownPostCssConfig: path.resolve(__dirname, '../postcss.config.js')
}
