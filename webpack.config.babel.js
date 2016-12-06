/* eslint-disable filenames/match-regex */
const path = require('path');

const PATH_OUTPUT = '/asset/build/';

const PATH_DESTINATION = path.join(__dirname, './public', PATH_OUTPUT);
const PATH_SOURCE = path.join(__dirname, './client');
const PATH_SOURCE_JS = `${PATH_SOURCE}/js`;
const FILE_ENTRY = `${PATH_SOURCE_JS}/app.js`;

const DEFAULT_OPTIONS = {
    dev: true
};

module.exports = function(options = DEFAULT_OPTIONS) {
    const { dev } = options;

    return {
        // devtool: dev ? 'cheap-module-eval-source-map' : 'hidden-source-map',

        entry: {
            main: FILE_ENTRY
        },

        output: {
            path: PATH_DESTINATION,
            filename: '[name].js'
        },

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                },
            ]
        },

        resolve: {
            modules: [
                PATH_SOURCE_JS,
                'node_modules'
            ],
        },

        devServer: {
            // Add GZip compression
            compress: true,

            // Use /public/ as the default content base
            contentBase: path.join(__dirname, 'public'),

            // index.html will catch all routes (allowing Router to do it's thing)
            historyApiFallback: true,

            // Hot module replacement
            // hot: true,

            // Enable HTTPS and HTTP/2
            https: true,

            // Hide the webpack bundle information
            // noInfo: true,

            // Match public path with output path
            publicPath: PATH_OUTPUT,

            watchOptions: {
                // Don't actively watch the node_modules folder to decrease CPU usage
                ignored: /node_modules/
            }
        }
    };
};
