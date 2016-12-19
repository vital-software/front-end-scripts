const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
    return path.resolve(appDirectory, relativePath);
}

module.exports = {
    appBuild: resolveApp('build'),
    appPublic: resolveApp('public'),
    appHtmlTemplate: resolveApp('public/index.html'),
    appJs: resolveApp('client/js'),
    appIndexJs: resolveApp('client/js/index.js'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('client'),
    ownNodeModules: path.resolve(__dirname, '../node_modules'),
    yarnLockFile: resolveApp('yarn.lock')
};
