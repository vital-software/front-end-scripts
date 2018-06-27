// Load in ENV values
require('./env')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const StylishWebpackPlugin = require('webpack-stylish')
const path = require('path')
const paths = require('./paths')

/*
    This is the development configuration.
    It is focused on developer experience and fast rebuilds.
    The production configuration is different and lives in a separate file.
 */
module.exports = {
    mode: 'development',

    devtool: 'cheap-module-source-map',

    entry: [
        paths.appIndexJs
        // We include the app code last so that if there is a runtime error during
        // initialization, it doesn't blow up Webpack Serve, and
        // changing JS code would still trigger a refresh.
    ],

    output: {
        // The output directory as an absolute path.
        path: paths.appBuild,

        // This does not produce a real file. It's just the virtual path that is
        // served by Webpack Serve in development. This is the JS bundle
        // containing code from all our entry points, and the Webpack runtime.
        filename: '[name].js',

        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: '[name].chunk.js',

        // Webpack uses `publicPath` to determine where the app is being served from.
        // in development, we always serve from the root. This makes config easier.
        publicPath: '/',

        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    },

    optimization: {
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

    // TODO: Once over
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg|webp)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000, // Byte limit for URL loader conversion
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
        new HtmlWebpackPlugin({
            template: paths.appHtml
        }),

        // Custom format webpack stats output so it doesn't look shit.
        new StylishWebpackPlugin()
    ]
}
