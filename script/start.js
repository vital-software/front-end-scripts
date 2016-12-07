/* eslint-disable no-console */

const chalk = require('chalk');
const clearConsole = require('../helper/clear-console');
const detect = require('detect-port');
const getProcessForPort = require('../helper/get-process-for-port');
const options = require('../webpack.config.babel.js');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const IS_INTERACTIVE = process.stdout.isTTY;
const DEFAULTS = {
    HOST: options.defaults.host,
    PORT: options.defaults.port,
    PROTOCOL: options.defaults.protocol
};

function run() {
    let config = options.webpack(),
        isFirstCompile = true;

    const showInstructions = IS_INTERACTIVE || isFirstCompile;

    if (showInstructions) {
        console.log();
        console.log('The app is running at:');
        console.log();
        console.log('  ', chalk.cyan(`${DEFAULTS.PROTOCOL}://${DEFAULTS.HOST}:${DEFAULTS.PORT}/`));
        console.log();
        console.log('Note that the development build is not optimized.');
        console.log('To create a production build, use', chalk.cyan('yarn run build'), '.');
        console.log();

        isFirstCompile = false;
    }

    let compiler = webpack(config);
    let devServer = new WebpackDevServer(compiler, options.webpack().devServer);

    // Launch WebpackDevServer
    devServer.listen(DEFAULTS.PORT, (error) => {
        if (error) {
            return console.log(error);
        }

        if (IS_INTERACTIVE) {
            // clearConsole();
        }

        console.log(chalk.cyan('Starting the development server...'));
        console.log();
    });
}

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
detect(DEFAULTS.PORT).then((port) => {
    if (port === DEFAULTS.PORT) {
        run();
        return;
    }

    if (IS_INTERACTIVE) {
        clearConsole();

        let existingProcess = getProcessForPort(DEFAULTS.PORT);
        let question = chalk.yellow(`Something is already running on port ${DEFAULTS.PORT}.`,
            ((existingProcess) ? ' Probably:\n  ' + existingProcess : '')) +
            '\n\nTry clearing any processes running on that port and running the command again.';
    } else {
        console.log(chalk.red(`Something is already running on port ${DEFAULTS.PORT}.`));
    }
});
