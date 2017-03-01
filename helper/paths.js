const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
    return path.resolve(appDirectory, relativePath);
}

module.exports = {
    appBuild: resolveApp('public'),
    appConfig: resolveApp('.build.config.js'),
    appCss: resolveApp('client/sass'),
    appHtmlTemplate: resolveApp('static/index.html'),
    appJs: resolveApp('client/js'),
    appIndexJs: resolveApp('client/js/index.js'),
    appPackageJson: resolveApp('package.json'),
    appPublic: resolveApp('static'),
    appSrc: resolveApp('client'),
    ownNodeModules: path.resolve(__dirname, '../node_modules'),
    ownPostCssConfig: path.resolve(__dirname, '../postcss.config.js')
};
