/* eslint-disable camelcase, filenames/match-regex */
// const BrotliPlugin = require('brotli-webpack-plugin')
// const BabelMinifyPlugin = require('babel-minify-webpack-plugin')
const paths = require('./helper/paths')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SplitChunksPlugin = require('webpack/lib/optimize/SplitChunksPlugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const {
    DefinePlugin,
    HotModuleReplacementPlugin,
    LoaderOptionsPlugin,
    NamedModulesPlugin,
    SourceMapDevToolPlugin
} = require('webpack')

// Load project config, or default to local project config
let appConfig = {
    devServer: {},
    entry: {},
    env: {},
    jsMinifyOpts: {},
    output: {},
    port: null,
    performance: {}
}

try {
    appConfig = require(paths.appConfig)
} catch (exception) {
    // Local project config file does not exist
}

// Options
const DEFAULT_PORT = 3000
const DEFAULT_HOST = '0.0.0.0'

const API = Object.assign(
    {
        prefix: '/api',
        prefixRewrite: '^/api',
        proxyUrl: 'http://localhost:9000'
    },
    appConfig.api
)
const PORT = appConfig.port || DEFAULT_PORT
const HOST = appConfig.host || DEFAULT_HOST
const PROTOCOL = 'http'
const URL_LOADER_LIMIT = 10000 // Byte limit for URL loader conversion

// const JS_MINIFY_OPTS = Object.assign(
//     {
//         removeConsole: true,
//         removeDebugger: true
//     },
//     appConfig.jsMinifyOpts
// )

// Helpers
function generateIndexEntry(isDev) {
    let indexEntry = [
        'react-hot-loader/patch' // React HMR
    ]

    if (isDev) {
        indexEntry.push(`webpack-dev-server/client?${PROTOCOL}://${HOST}/`)
        indexEntry.push('webpack/hot/only-dev-server')
    }

    indexEntry.push(paths.appIndexJs)

    return indexEntry
}

function generatePlugins(isDev, isTest, filename) {
    let plugins = [
        // new SplitChunksPlugin({
        //     name: 'vendor',
        //     filename: 'vendor.js',
        //
        //     // The minimum number of chunks which need to contain a module before it's moved into the commons chunk.
        //     minChunks: 2,
        //
        //     // Minimum size of all common module before a commons chunk is created.
        //     minSize: 2
        // }),
        // Set Node/Run settings to optimise code
        new DefinePlugin({
            'process.env': Object.assign(
                {
                    NODE_ENV: isDev && !isTest ? JSON.stringify('development') : JSON.stringify('production'),
                    RUN_ENV: JSON.stringify('browser')
                },
                appConfig.env
            )
        }),
        new ExtractTextPlugin({
            disable: isDev,
            filename: `${filename}.css`
        }),
        new HtmlWebpackPlugin({
            template: paths.appHtmlTemplate
        })
    ]

    if (!isDev) {
        plugins.push(
            new SourceMapDevToolPlugin({
                test: /\.js$/,
                filename: `../sourcemap/${filename}.js.map`,
                noSources: true,
                append: false
            })
        )

        plugins.push(
            new SourceMapDevToolPlugin({
                test: /\.css$/,
                filename: `../sourcemap/${filename}.css.map`,
                noSources: true,
                append: false
            })
        )
    }

    if (isTest) {
        return plugins
    }

    if (isDev) {
        // Enable HMR globally
        plugins.push(new HotModuleReplacementPlugin())
    } else {
        // Set debug/minimize settings for production
        // plugins.push(
        //     new LoaderOptionsPlugin({
        //         debug: false,
        //         minimize: true
        //     })
        // )
        // Optimise Javascript
        // Waiting on Webpack 4 support: https://github.com/webpack-contrib/babel-minify-webpack-plugin/pull/70
        // plugins.push(
        //     new BabelMinifyPlugin(JS_MINIFY_OPTS, {
        //         comments: false,
        //         sourceMaps: 'eval'
        //     })
        // )
        // Generate Brotli static assets
        // plugins.push(
        //     new BrotliPlugin({
        //         test: /\.(js|css|svg)$/,
        //         threshold: 10240
        //     })
        // )
        //
    }

    return plugins
}

// Webpack config
module.exports = {
    defaults: {
        host: HOST,
        port: PORT,
        protocol: PROTOCOL
    },
    webpack: function(options) {
        const { dev, shortName, test } = Object.assign(
            { dev: true, shortName: false, test: false },
            options,
            appConfig.options
        )

        // Setup filename
        const filename = shortName ? '[name]' : '[name].[chunkhash]'

        const indexEntry = generateIndexEntry(dev)
        const plugins = generatePlugins(dev, test, filename)
        const entry = Object.assign({ index: indexEntry }, appConfig.entry)
        const output = Object.assign(
            {
                path: paths.appBuild,
                filename: `${filename}.js`,
                publicPath: '/'
            },
            appConfig.output
        )
        const devServer = Object.assign(
            {
                // Can't use gzip compression, because it causes SSE buffering
                compress: false,

                // Use /static/ as the default content base
                contentBase: paths.appPublic,

                // Support a proxy server
                disableHostCheck: true,

                // index.html will catch all routes (allowing Router to do it's thing)
                historyApiFallback: true,

                // Hot module replacement (only in 'dev' mode)
                hot: dev,

                // Allow serving externally
                host: '0.0.0.0',

                // Enable HTTPS and HTTP/2
                https: false,

                // Hide the webpack bundle information
                noInfo: true,

                // Proxy API to /api
                proxy: {
                    [API.prefix]: {
                        pathRewrite: { [API.prefixRewrite]: '' },
                        target: API.proxyUrl
                    }
                },

                // Match public path with output path
                publicPath: '/',

                watchOptions: {
                    // Don't actively watch the node_modules folder to decrease CPU usage
                    ignored: /node_modules/
                }
            },
            appConfig.devServer
        )

        const mode = dev ? 'development' : 'production'

        const smp = new SpeedMeasurePlugin(
            test && {
                outputFormat: 'json',
                outputTarget: 'perf/webpack.speed.json'
            }
        )

        return smp.wrap({
            mode,

            // TODO: Webpack source maps are... rubbish. -> https://github.com/webpack/webpack/issues/2145
            devtool: dev ? 'source-map' : false,

            entry: entry,

            output: output,

            optimization: {
                minimize: !test,
                minimizer:
            },

            module: {
                rules: [
                    {
                        test: /\.(jpe?g|png|gif|svg|webp)$/,
                        loader: 'url-loader',
                        options: {
                            limit: URL_LOADER_LIMIT,
                            name: '[path][name].[ext]'
                        }
                    },
                    {
                        test: /\.(graphql|gql)$/,
                        exclude: /node_modules/,
                        loader: 'graphql-tag/loader'
                    },
                    {
                        test: /\.(js|jsx|flow)$/,
                        include: [/node_modules\/@vital-software\/web-utils\/lib/, /.*\/app/],
                        loader: 'babel-loader'
                    },
                    {
                        test: /\.(css|scss)$/,
                        loader: ExtractTextPlugin.extract({
                            fallback: {
                                loader: 'style-loader', // Add CSS to HTML page (uses JavaScript)
                                options: { sourceMap: true }
                            },
                            use: [
                                // Process and handle CSS (importLoaders ensures @import files use the next loader - PostCSS)
                                {
                                    loader: 'css-loader',
                                    options: {
                                        importLoaders: 1,
                                        sourceMap: true
                                    }
                                },
                                // Process PostCSS
                                {
                                    loader: 'postcss-loader',
                                    options: {
                                        config: {
                                            ctx: { isTest: test },
                                            path: paths.ownPostCssConfig
                                        }
                                    }
                                }
                            ]
                        })
                    }
                ]
            },

            plugins: plugins,

            resolve: {
                extensions: ['.css', '.gql', '.graphql', '.js', '.json', '.jsx', '.scss', '.flow'],

                modules: ['node_modules', paths.appCss, paths.appSrc, paths.appPublic]
            },

            resolveLoader: {
                // Ensure loaders are loaded from vitalizer directory
                modules: ['node_modules']
            },

            performance: Object.assign(
                {
                    // Disable 250kb JavaScript entry file warnings
                    hints: dev ? false : 'warning'
                },
                appConfig.performance
            ),

            devServer: devServer
        })
    }
}
