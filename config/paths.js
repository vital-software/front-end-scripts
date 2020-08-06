const path = require('path')
const fs = require('fs')

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

// Use custom defined HTML files, or default to 'static/index.html'
const defaultIndex = 'static/index.html'
const htmlFiles = process.env.INDEX_FILES ? process.env.INDEX_FILES.replace(/\s+/g, '').split(',') : [defaultIndex]

// Use custom defined build output folder, or default to 'public'
const buildDirectoryFolderName = process.env.BUILD_DIR ? process.env.BUILD_DIR : 'public'

module.exports = {
    appBabelConfig: resolveApp('.babelrc'),
    appBuild: resolveApp(buildDirectoryFolderName),
    appComponentLibrary: resolveApp('node_modules/@vital-software/components'),
    appIndexHtml: resolveApp(defaultIndex),
    appIndexTsx: resolveApp('app/index.tsx'),
    appNodeModules: resolveApp('node_modules'),
    appPath: resolveApp('.'),
    appPublic: resolveApp('static'),
    appSrc: resolveApp('app'),
    appDevServerConfig: resolveApp('serve.config.dev.js'),
    appWebpackDevConfig: resolveApp('webpack.config.dev.js'),
    dotenv: resolveApp('.vitalizer'),
    htmlFiles,
    resolveApp
}
