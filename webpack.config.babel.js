/* eslint-disable camelcase */
const paths = require('./helper/paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SplitChunksPlugin = require('webpack/lib/optimize/SplitChunksPlugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { DefinePlugin, HotModuleReplacementPlugin, SourceMapDevToolPlugin } = require('webpack')
const isProd = process.env.NODE_ENV === 'production'

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

// Default Config
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

// Uglify JS Pulgin Options
const JS_MINIFY_OPTS = Object.assign(
    {
        removeDebugger: true,
        removeConsole: true,
        mangle: false
    },
    appConfig.jsMinifyOpts
)

const JS_MINIFY_PLUGIN_OPTS = {
    sourceMap: true
}

// Webpack config
module.exports = {
    defaults: {
        host: HOST,
        port: PORT,
        protocol: PROTOCOL
    },
    webpack: function(options) {
        const { dev: isDev, shortName, test: isTest } = Object.assign(
            { dev: true, shortName: false, test: false },
            options,
            appConfig.options
        )

        // Mode
        const mode = isDev ? 'development' : 'production'

        // Devtool
        const devtool = isDev ? 'cheap-module-source-map' : false

        // Entry
        const indexEntry = []

        if (isDev) {
            indexEntry.unshift(
                'react-hot-loader/patch',
                `webpack-dev-server/client?${PROTOCOL}://${HOST}/`,
                'webpack/hot/only-dev-server'
            )
        }
        indexEntry.push(paths.appIndexJs)
        const entry = { index: indexEntry }

        // Output
        const filename = shortName ? '[name]' : '[name].[chunkhash]'
        const output = Object.assign(
            {
                path: paths.appBuild,
                filename: `${filename}.js`,
                publicPath: '/'
            },
            appConfig.output
        )

        // Optimization
        const optimization = {
            minimize: isProd && !isTest,
            minimizer: [new MinifyPlugin(JS_MINIFY_OPTS, JS_MINIFY_PLUGIN_OPTS)]
        }

        // Module
        const cssLoaders = [
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
                        ctx: { isTest },
                        path: paths.ownPostCssConfig
                    }
                }
            }
        ]

        const module = {
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
                    loader: isDev
                        ? [
                            {
                                loader: 'style-loader', // Add CSS to HTML page (uses JavaScript)
                                options: { sourceMap: true }
                            },
                            ...cssLoaders
                        ]
                        : [MiniCssExtractPlugin.loader, ...cssLoaders]
                }
            ]
        }

        // Plugins
        const plugins = generatePlugins(isDev, isTest, filename)

        // Resolve
        const resolve = {
            extensions: ['.css', '.gql', '.graphql', '.js', '.json', '.jsx', '.scss', '.flow'],
            modules: ['node_modules', paths.appCss, paths.appSrc, paths.appPublic]
        }

        // Resolve Loaders - Ensure loaders are loaded from vitalizer directory
        const resolveLoader = {
            modules: ['node_modules']
        }

        // Performance
        const performance = Object.assign(
            {
                // Disable 250kb JavaScript entry file warnings
                hints: isDev ? false : 'warning'
            },
            appConfig.performance
        )

        // Webpack Dev Server
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
                // Hot module replacement (only in 'development' mode)
                hot: isDev,
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
                publicPath: '/'
            },
            appConfig.devServer
        )

        // Measure the speed of the build
        const smp = new SpeedMeasurePlugin(
            isTest && {
                outputFormat: 'json',
                outputTarget: 'perf/webpack.speed.json'
            }
        )

        // Main Webpack config
        return smp.wrap({
            mode,
            devtool,
            entry,
            output,
            optimization,
            module,
            plugins,
            resolve,
            resolveLoader,
            performance,
            devServer
        })
    }
}

function generatePlugins(isDev, isTest, filename) {
    let plugins = [
        new SplitChunksPlugin({
            name: 'vendor',
            filename: 'vendor.js',
            // The minimum number of chunks which need to contain a module before it's moved into the commons chunk.
            minChunks: 2,
            // Minimum size of all common module before a commons chunk is created.
            minSize: 2
        }),
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
        new HtmlWebpackPlugin({
            template: paths.appHtmlTemplate
        })
    ]

    if (!isDev) {
        plugins.push(
            new MiniCssExtractPlugin({
                filename: `${filename}.css`
            })
        )

        plugins.push(
            new SourceMapDevToolPlugin({
                test: /\.js$/,
                filename: `${filename}.js.map`
            })
        )

        plugins.push(
            new SourceMapDevToolPlugin({
                test: /\.css$/,
                filename: `${filename}.css.map`
            })
        )
    }

    if (isTest) {
        return plugins
    }

    if (isDev) {
        // Enable HMR globally
        plugins.push(new HotModuleReplacementPlugin())
    }

    return plugins
}
