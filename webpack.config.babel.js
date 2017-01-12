/* eslint-disable camelcase, filenames/match-regex */
const paths = require('./helper/paths');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    DefinePlugin,
    HotModuleReplacementPlugin,
    LoaderOptionsPlugin,
    NamedModulesPlugin,
    optimize
} = require('webpack');


// Options
const HOST = 'localhost';
const PORT = 3000;
const PROTOCOL = 'https';
const WEBPACK_DEFAULT_OPTIONS = {
    dev: true,
    linkedInstall: false // Used for 'npm link' local installs (for debugging)
};


// Helpers
function generateIndexEntry(isDev) {
    let indexEntry = [];

    if (isDev) {
        indexEntry.push(`webpack-dev-server/client?${PROTOCOL}://${HOST}:${PORT}/`);
        indexEntry.push('webpack/hot/only-dev-server');
    }

    indexEntry.push(paths.appIndexJs);

    return indexEntry;
}

function generatePlugins(isDev) {
    let plugins = [
        new ExtractTextPlugin({
            disable: isDev,
            filename: '[name].[chunkhash].css'
        }),
        new HtmlWebpackPlugin({
            template: paths.appHtmlTemplate
        })
    ];

    if (isDev) {
        // Enable HMR globally
        plugins.push(new HotModuleReplacementPlugin());

        // Prints more readable module names in the browser console on HMR updates
        plugins.push(new NamedModulesPlugin());
    } else {
        // Set debug/minimize settings for production
        plugins.push(new LoaderOptionsPlugin({
            debug: false,
            minimize: true
        }));

        // Set Node/Run settings to optimise code
        plugins.push(new DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                'RUN_ENV': JSON.stringify('browser')
            }
        }));

        // Uglify Javascript
        plugins.push(new optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
            compress: {
                conditionals: true,
                dead_code: true,
                drop_console: true,
                drop_debugger: true,
                screw_ie8: true,
                warnings: false
            },
            mangle: {
                keep_fnames: true,
                screw_ie8: true,
                vars: true
            },
            sourceMap: true
        }));
    }

    return plugins;
}


// Webpack config
module.exports = {
    defaults: {
        host: HOST,
        port: PORT,
        protocol: PROTOCOL
    },
    webpack: function(options = WEBPACK_DEFAULT_OPTIONS) {
        const {
            dev,
            linkedInstall
        } = options;

        const indexEntry = generateIndexEntry(dev);
        const plugins = generatePlugins(dev);

        return {
            devtool: dev ? 'cheap-module-eval-source-map' : 'source-map',

            entry: {
                index: indexEntry
            },

            output: {
                path: paths.appBuild,
                filename: dev ? '[name].js' : '[name].[chunkhash].js',
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
                        // TODO: Update from 'loader' to 'use' when ExtractTextPlugin is updated to Webpack2 syntax
                        loader: ExtractTextPlugin.extract({
                            fallbackLoader: 'style-loader', // Add CSS to HTML page (uses JavaScript)
                            loader: [
                                 // Process and handle CSS (importLoaders ensures @import files use the next loader - PostCSS)
                                { loader: 'css-loader', query: { importLoaders: 1, sourceMap: true } },
                                // Process PostCSS
                                { loader: 'postcss-loader', query: { config: paths.ownPostCssConfig } }
                            ]
                        }),
                    },
                ]
            },

            plugins: plugins,

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
                    (linkedInstall ? paths.ownNodeModules : 'node_modules')
                ]
            },

            performance: {
                // Disable 250kb JavaScript entry file warnings
                hints: (dev ? false : 'warning')
            },

            devServer: {
                // Add GZip compression
                compress: true,

                // Use /public/ as the default content base
                contentBase: paths.appBuild,

                // index.html will catch all routes (allowing Router to do it's thing)
                historyApiFallback: true,

                // Hot module replacement (only in 'dev' mode)
                hot: dev,

                // Enable HTTPS and HTTP/2
                https: true,

                // Hide the webpack bundle information
                noInfo: true,

                // Match public path with output path
                publicPath: '/',

                watchOptions: {
                    // Don't actively watch the node_modules folder to decrease CPU usage
                    ignored: /node_modules/
                }
            }
        };
    }
};
