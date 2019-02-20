// Load in ENV values
const getClientEnvironment = require('./env')
const env = getClientEnvironment()
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const paths = require('./paths')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const StylishWebpackPlugin = require('webpack-stylish')
const WatchMissingNodeModulesPlugin = require('../helper/watch-missing-node-modules-plugin')
const webpack = require('webpack')
// Measure the speed of the build
const smp = new SpeedMeasurePlugin()

/*
    This is the development configuration.
    It is focused on developer experience and fast rebuilds.
    The production configuration is different and lives in a separate file.
 */
module.exports = smp.wrap({
    mode: 'development',

    // Set development source mapping.
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
        // We always serve from the root. This makes config easier.
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
        // Support multiple path module lookup (i.e. app/sass module root support).
        modules: process.env.RESOLVE_MODULES
            ? ['node_modules']
                .concat(process.env.RESOLVE_MODULES.split(',').map((string) => string.trim()))
                .map(paths.resolveApp)
            : ['node_modules'],

        // These are the reasonable defaults supported by the Node ecosystem.
        extensions: ['.gql', '.graphql', '.mjs', '.js', '.json', '.jsx', '.flow', '.css', '.scss'],
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },

    module: {
        rules: [
            // Disable require.ensure as it's not a standard language feature.
            { parser: { requireEnsure: false } },

            {
                // "oneOf" will traverse all following loaders until one will
                // match the requirements. When no loader matches it will fall
                // back to the "file" loader at the end of the loader list.
                oneOf: [
                    // "url" loader works just like "file" loader but it also embeds
                    // assets smaller than specified size as data URLs to avoid requests.
                    {
                        test: /\.(gif|jpe?g|png|svg|webp)$/,
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000, // Byte limit for URL loader conversion
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    },

                    // Process application JS with Babel.
                    // The preset includes JSX, Flow, and some ESnext features.
                    {
                        test: /\.(flow|js|jsx|mjs)$/,
                        include: paths.srcPaths,
                        exclude: [/[/\\\\]node_modules[/\\\\]/],
                        use: [
                            // This loader parallelizes code compilation, it is optional but
                            // improves compile time on larger projects
                            {
                                loader: require.resolve('thread-loader'),
                                options: {
                                    poolTimeout: Infinity // keep workers alive for more effective watch mode
                                }
                            },
                            {
                                loader: require.resolve('babel-loader'),
                                options: {
                                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                                    // It enables caching results in ./node_modules/.cache/babel-loader/
                                    // directory for faster rebuilds.
                                    cacheDirectory: true,
                                    highlightCode: true
                                }
                            }
                        ]
                    },

                    // "postcss" loader applies autoprefixer to our CSS.
                    // "css" loader resolves paths in CSS and adds assets as dependencies.
                    // `MiniCSSExtractPlugin` extracts styles into CSS
                    // files. If you use code splitting, async bundles will have their own separate CSS chunk file.
                    // By default we support CSS Modules with the extension .module.css
                    {
                        test: /\.(css|scss)$/,
                        use: [
                            {
                                loader: 'style-loader', // Add CSS to HTML page (uses JavaScript)
                                options: { sourceMap: true }
                            },
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                    sourceMap: true
                                }
                            },
                            {
                                // Options for PostCSS as we reference these options twice
                                // Adds vendor prefixing based on your specified browser support in
                                // package.json
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    config: {
                                        path: path.join(__dirname, './postcss.config.js')
                                    },

                                    // Necessary for external CSS imports to work
                                    // https://github.com/facebook/create-react-app/issues/2677
                                    ident: 'postcss',

                                    sourceMap: true
                                }
                            }
                        ]
                    },

                    // The GraphQL loader preprocesses GraphQL queries in .graphql files.
                    {
                        test: /\.(graphql)$/,
                        loader: 'graphql-tag/loader'
                    },

                    // "file" loader makes sure assets end up in the `build` folder.
                    // When you `import` an asset, you get its filename.
                    // This loader doesn't use a "test" so it will catch all modules
                    // that fall through the other loaders.
                    {
                        loader: require.resolve('file-loader'),
                        // Exclude `js` files to keep "css" loader working as it injects
                        // it's runtime that would otherwise be processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [/\.(flow|js|jsx|mjs)$/, /\.html$/, /\.json$/],
                        options: {
                            name: '[path][name].[hash:8].[ext]'
                        }
                    }
                    // ** STOP ** Are you adding a new loader?
                    // Make sure to add the new loader(s) before the "file" loader.
                ]
            }
        ]
    },

    plugins: [
        // Generates `index.html` files with the <script> injected.
        ...paths.appHtmlFiles.map(
            (filename) =>
                new HtmlWebpackPlugin({
                    filename: filename.replace('static', 'public'),
                    template: filename
                })
        ),

        // Makes some environment variables available to the JS code.
        // It is absolutely essential that NODE_ENV was set to production here.
        // Otherwise React will be compiled in the very slow development mode.
        new webpack.DefinePlugin(env.stringified),

        // Watcher doesn't work well if you mistype casing in a path so we use
        // a plugin that prints an error when you attempt to do this.
        // See https://github.com/facebook/create-react-app/issues/240
        new CaseSensitivePathsPlugin(),

        // If you require a missing module and then `yarn add` it, you still have
        // to restart the development server for Webpack to discover it. This plugin
        // makes the discovery automatic so you don't have to restart.
        // See https://github.com/facebook/create-react-app/issues/186
        new WatchMissingNodeModulesPlugin(paths.appNodeModules),

        // Custom format webpack stats output so it doesn't look shit.
        new StylishWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
})
