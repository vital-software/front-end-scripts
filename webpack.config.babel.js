/* eslint-disable filenames/match-regex */
const paths = require('./helper/paths');


// Options
const HOST = 'localhost';
const PORT = 3000;
const PROTOCOL = 'https';
const WEBPACK_DEFAULT_OPTIONS = {
    dev: true
};


// Webpack config
module.exports = {
    defaults: {
        host: HOST,
        port: PORT,
        protocol: PROTOCOL
    },
    webpack: function(options = WEBPACK_DEFAULT_OPTIONS) {
        // TODO: use this value
        const { dev } = options; // eslint-disable-line

        return {
            // devtool: dev ? 'cheap-module-eval-source-map' : 'hidden-source-map',

            entry: {
                index: [
                    `webpack-dev-server/client?${PROTOCOL}://${HOST}:${PORT}/`,
                    paths.appIndexJs
                ]
            },

            output: {
                // path: paths.appBuild,
                filename: '[name].js'
            },

            module: {
                rules: [
                    {
                        test: /\.(js|jsx)$/,
                        exclude: /node_modules/,
                        use: 'babel-loader'
                    },
                    {
                        test: /\.(css|scss)$/,
                        use: 'css-loader'
                    },
                ]
            },

            resolve: {
                modules: [
                    paths.appJs,
                    'node_modules'
                ],
            },

            resolveLoader: {
                // Ensure loaders are loaded from front-end-scripts directory
                modules: [
                    paths.ownNodeModules
                ]
            },

            devServer: {
                // Add GZip compression
                compress: true,

                // Use /public/ as the default content base
                contentBase: paths.appPublic,

                // index.html will catch all routes (allowing Router to do it's thing)
                historyApiFallback: true,

                // Hot module replacement
                // hot: true,

                // Enable HTTPS and HTTP/2
                https: true,

                // Hide the webpack bundle information
                noInfo: true,

                // Match public path with output path
                // TODO: Make config
                publicPath: '/build/',

                watchOptions: {
                    // Don't actively watch the node_modules folder to decrease CPU usage
                    ignored: /node_modules/
                }
            }
        };
    }
};
