const chalk = require('chalk');
const clearConsole = require('../helper/clear-console');
const config = require('../webpack.config.babel.js');
const detect = require('detect-port');
const formatWebpackMessages = require('../helper/format-webpack-messages');
const getProcessForPort = require('../helper/get-process-for-port');
const prompt = require('../helper/prompt');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const IS_INTERACTIVE = process.stdout.isTTY;
const DEFAULTS = {
    PORT: process.env.PORT || 3000, // eslint-disable-line
    PROTOCOL: 'https'
};

let compiler;

function setupCompiler(host, port) {
    // "Compiler" is a low-level interface to Webpack.
    // It lets us listen to some events and provide our own custom messages.
    compiler = webpack(config());

    // "invalid" event fires when you have changed a file, and Webpack is
    // recompiling a bundle. WebpackDevServer takes care to pause serving the
    // bundle, so if you refresh, it'll wait instead of serving the old one.
    // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
    compiler.plugin('invalid', function() {
        if (IS_INTERACTIVE) {
            clearConsole();
        }
        console.log('Compiling...');
    });

    let isFirstCompile = true;

    // "done" event fires when Webpack has finished recompiling the bundle.
    // Whether or not you have warnings or errors, you will get this event.
    compiler.plugin('done', function(stats) {
        if (IS_INTERACTIVE) {
            clearConsole();
        }

        // We have switched off the default Webpack output in WebpackDevServer
        // options so we are going to "massage" the warnings and errors and present
        // them in a readable focused way.
        let isSuccessful,
            messages,
            showInstructions;

        messages = formatWebpackMessages(stats.toJson({}, true));
        isSuccessful = !messages.errors.length && !messages.warnings.length;
        showInstructions = isSuccessful && (IS_INTERACTIVE || isFirstCompile);

        if (isSuccessful) {
            console.log(chalk.green('Compiled successfully!'));
        }

        if (showInstructions) {
            console.log();
            console.log('The app is running at:');
            console.log();
            console.log('  ', chalk.cyan(`${DEFAULTS.PROTOCOL}://${host}:${port}/`));
            console.log();
            console.log('Note that the development build is not optimized.');
            console.log('To create a production build, use', chalk.cyan('yarn run build'), '.');
            console.log();

            isFirstCompile = false;
        }

        // If errors exist, only show errors.
        if (messages.errors.length) {
            console.log(chalk.red('Failed to compile.'));
            console.log();
            messages.errors.forEach((message) => {
                console.log(message);
                console.log();
            });
            return;
        }

        // Show warnings if no errors were found.
        if (messages.warnings.length) {
            console.log(chalk.yellow('Compiled with warnings.'));
            console.log();
            messages.warnings.forEach((message) => {
                console.log(message);
                console.log();
            });

            // Teach some ESLint tricks.
            console.log('You may use special comments to disable some warnings.');
            console.log('Use', chalk.yellow('// eslint-disable-next-line'), 'to ignore the next line.');
            console.log('Use', chalk.yellow('/* eslint-disable */'), 'to ignore all warnings in a file.');
        }
    });
}

function runDevServer(host, port) {
    const devServer = new WebpackDevServer(compiler, config().devServer);

    // Launch WebpackDevServer
    devServer.listen(port, (error) => {
        if (error) {
            return console.log(error);
        }

        if (IS_INTERACTIVE) {
            clearConsole();
        }

        console.log(chalk.cyan('Starting the development server...'));
        console.log();
    });
}

function run(port) {
    const host = process.env.HOST || 'localhost';

    setupCompiler(host, port);
    runDevServer(host, port);
}

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
detect(DEFAULTS.PORT).then((port) => {
    if (port === DEFAULTS.PORT) {
        run(port);
        return;
    }

    if (IS_INTERACTIVE) {
        clearConsole();

        let existingProcess = getProcessForPort(DEFAULTS.PORT);
        let question = chalk.yellow(`Something is already running on port ${DEFAULTS.PORT}.`,
            ((existingProcess) ? ' Probably:\n  ' + existingProcess : '')) +
            '\n\nWould you like to run the app on another port instead?';

        prompt(question, true).then((shouldChangePort) => {
            if (shouldChangePort) {
                run(port);
            }
        });
    } else {
        console.log(chalk.red(`Something is already running on port ${DEFAULTS.PORT}.`));
    }
});
