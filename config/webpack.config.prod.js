// Load in ENV values
const getClientEnvironment = require('./env')
const env = getClientEnvironment()

const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const StylishWebpackPlugin = require('webpack-stylish')
const path = require('path')
const paths = require('./paths')
const webpack = require('webpack')

// Measure the speed of the build
const smp = new SpeedMeasurePlugin()

/*
    This is the production configuration.
    It compiles slowly and is focused on producing a fast and minimal bundle.
    The development configuration is different and lives in a separate file.
 */
module.exports = smp.wrap({
    mode: 'production',

    // Don't attempt to continue if there are any errors.
    bail: true,

    // We generate sourcemaps in production. This is slow but gives good results.
    devtool: 'source-map',

    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,

    // In production, we only want to the app code.
    entry: [paths.appIndexJs],

    output: {
        // The output directory as an absolute path.
        path: paths.appBuild,

        // Generated JS file names (with nested folders).
        // There will be one main bundle, and one file per asynchronous chunk.
        filename: '[name].[chunkhash:8].js',

        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: '[name].[chunkhash:8].chunk.js',

        // Webpack uses `publicPath` to determine where the app is being served from.
        // We always serve from the root. This makes config easier.
        publicPath: '/',

        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    // Supported ECMAScript Version.
                    ecma: 8,

                    compress: {
                        // Discard calls to console.* functions.
                        drop_console: true
                    },

                    mangle: {
                        // Work around the Safari 10 loop iterator bug.
                        safari10: true,
                        toplevel: true
                    },

                    output: {
                        // Turned on because emoji and regex is not minified properly using default
                        ascii_only: true
                    }
                },

                // Extract comments (i.e. licenses) to a separate file.
                // https://github.com/webpack/webpack/commit/71933e979e51c533b432658d5e37917f9e71595a
                extractComments: true,

                // Use multi-process parallel running to improve the build speed
                // Default number of concurrent runs: os.cpus().length - 1
                parallel: true,

                // Enable file caching
                cache: true,

                // Use source maps to map error message locations to module
                sourceMap: true
            })
        ],

        // Automatically split vendor and commons
        // https://twitter.com/wSokra/status/969633336732905474
        // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
        splitChunks: {
            chunks: 'all',
            name: 'vendors'
        },

        // Keep the runtime chunk seperated to enable long term caching
        // https://twitter.com/wSokra/status/969679223278505985
        runtimeChunk: true
    },

    resolve: {
        modules: ['node_modules']
            .concat(process.env.RESOLVE_MODULES.split(',').map((string) => string.trim()))
            .map(paths.resolveApp),

        // These are the reasonable defaults supported by the Node ecosystem.
        extensions: ['.gql', '.graphql', '.mjs', '.js', '.json', '.jsx', '.flow', '.css', '.scss'],

        alias: {
            // Ensure webpack-hot-client uses the correct node_modules
            'webpack-hot-client/client': path.join(__dirname, '../node_modules/webpack-hot-client/client')
        }
    },

    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg|webp)$/,
                exclude: [/[/\\\\]node_modules[/\\\\]/],
                loader: 'url-loader',
                options: {
                    limit: 10000, // Byte limit for URL loader conversion
                    name: '[path][name].[ext]'
                }
            },
            {
                test: /\.(graphql)$/,
                exclude: [/[/\\\\]node_modules[/\\\\]/],
                loader: 'graphql-tag/loader'
            },
            {
                test: /\.(js|jsx|flow|mjs)$/,
                include: [/node_modules\/@vital-software\/web-utils\/lib/, /.*\/app/],
                loader: require.resolve('babel-loader'),
                options: {
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true
                }
            },
            {
                test: /\.(css|scss)$/,
                loader: [
                    {
                        loader: 'style-loader', // Add CSS to HTML page (uses JavaScript)
                        options: { sourceMap: true }
                    },
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
                                ctx: { isTest: false },
                                path: path.join(__dirname, './postcss.config.js')
                            }
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            template: paths.appHtml
        }),

        new webpack.DefinePlugin(env.stringified),

        // Custom format webpack stats output so it doesn't look shit.
        new StylishWebpackPlugin()
    ]
})
