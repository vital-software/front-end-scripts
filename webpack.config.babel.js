/* eslint-disable filenames/match-regex */
const paths = require('./helper/paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
                path: paths.appBuild,
                filename: '[name].[hash].js',
                publicPath: '/'
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
                        use: [
                            // Add CSS to HTML page (uses JavaScript)
                            'style-loader',
                             // Process and handle CSS (importLoaders ensures @import files use the next loader - PostCSS)
                            { loader: 'css-loader', options: { importLoaders: 1, sourceMap: true } },
                            // Process PostCSS
                            { loader: 'postcss-loader', options: { config: paths.ownPostCssConfig } }
                        ]
                    },
                ]
            },

            plugins: [
                new HtmlWebpackPlugin({
                    template: paths.appHtmlTemplate
                })
            ],

            resolve: {
                extensions: ['.css', '.js', '.json', '.jsx', '.scss'],

                modules: [
                    paths.appJs,
                    paths.appSrc,
                    'node_modules'
                ],
            },

            resolveLoader: {
                // Ensure loaders are loaded from front-end-scripts directory
                modules: [
                    paths.ownNodeModules
                ]
            },

            performance: {
                // Disable 250kb JavaScript entry file warnings
                hints: false
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
