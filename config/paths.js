const path = require('path')
const fs = require('fs')
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
// Use custom defined HTML files, or default to 'static/index.html'
const defaultIndex = 'static/index.html'
const htmlFiles = process.env.INDEX_FILES ? process.env.INDEX_FILES.replace(/\s+/g, '').split(',') : [defaultIndex]

module.exports = {
    dotenv: resolveApp('.vitalizer'),
    appPath: resolveApp('.'),
    appBuild: resolveApp('public'),
    appPublic: resolveApp('static'),
    appIndexHtml: resolveApp(defaultIndex),
    appHtmlFiles: htmlFiles.map(resolveApp),
    appIndexTsx: resolveApp('app/index.tsx'),
    appSrc: resolveApp('app'),
    appNodeModules: resolveApp('node_modules')
}

module.exports.resolveApp = resolveApp
