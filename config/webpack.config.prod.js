// Load in ENV values
const getClientEnvironment = require('./env')
const env = getClientEnvironment()
const { GenerateSW } = require('workbox-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const paths = require('./paths')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const StylishWebpackPlugin = require('webpack-stylish')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
// Measure the speed of the build
const smp = new SpeedMeasurePlugin()
// Configure file names to use hashing or not
const fileName = process.env.DISABLE_HASH ? '[name]' : '[name].[chunkhash:8]'
// Configure CDN or local urls
const publicPath = process.env.CDN_URL ? process.env.CDN_URL : '/'
// HTML Minification
const htmlMinifyOptions = {
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
}

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
    // our own hints via the FileSizeReporter.
    performance: false,

    // In production, we only want the app code.
    entry: paths.appIndexTsx,

    output: {
        // The output directory as an absolute path.
        path: paths.appBuild,

        // Generated JS file names (with nested folders).
        // There will be one main bundle, and one file per asynchronous chunk.
        filename: `${fileName}.js`,

        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: `${fileName}.chunk.js`,

        // Webpack uses `publicPath` to determine where the app is being served from.
        // We either serve from the root, or a CDN url. This makes config easier.
        publicPath,

        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    },

    optimization: {
        minimizer: [
            // JavaScript minfier
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        // we want terser to parse ecma 8 code. However, we don't want it
                        // to apply any minfication steps that turns valid ecma 5 code
                        // into invalid ecma 5 code. This is why the 'compress' and 'output'
                        // sections only apply transformations that are ecma 5 safe
                        // https://github.com/facebook/create-react-app/pull/4234
                        ecma: 8
                    },
                    compress: {
                        // Discard calls to console.* functions.
                        drop_console: true,

                        // Disabled because of an issue with Terser breaking valid code:
                        // https://github.com/facebook/create-react-app/issues/5250
                        // Pending futher investigation:
                        // https://github.com/terser-js/terser/issues/120
                        inline: 2,

                        // Keep classnames & function names for react component stack traces
                        keep_classnames: true,
                        keep_fnames: true,

                        ecma: 5,

                        warnings: false,

                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebook/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false
                    },
                    mangle: {
                        // Work around the Safari 10 loop iterator bug.
                        safari10: true,
                        toplevel: true,

                        // Keep classnames & function names for react component stack traces
                        keep_classnames: true,
                        keep_fnames: true
                    },
                    output: {
                        ecma: 5,

                        comments: false,

                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebook/create-react-app/issues/2488
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
            }),

            // CSS Minifier (uses cssnano)
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    // Removes unnecessary prefixes based on browser support.
                    autoprefixer: true,

                    // Ensure Z-Index is maintained
                    zindex: false,

                    // Ensure external source map file is used.
                    map: {
                        inline: false
                    }
                }
            })
        ],

        // Automatically split vendor and commons
        // https://twitter.com/wSokra/status/969633336732905474
        // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
        splitChunks: {
            chunks(chunk) {
                // exclude `polyfills`
                return chunk.name !== 'polyfills'
            },
            name: 'vendor'
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
        extensions: ['.gql', '.graphql', '.mjs', '.js', '.json', '.jsx', '.flow', '.ts', '.tsx']
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
                            name: `[path]${fileName}.[ext]`
                        }
                    },

                    // Process application JS with Babel.
                    // The preset includes JSX, Flow, and some ESnext features.
                    {
                        test: /\.(flow|js|jsx|mjs|ts|tsx)$/,
                        include: paths.srcPaths,
                        exclude: [/[/\\\\]node_modules[/\\\\]/],
                        use: [
                            // This loader parallelizes code compilation, it is optional but
                            // improves compile time on larger projects
                            require.resolve('thread-loader'),
                            {
                                loader: require.resolve('babel-loader'),
                                options: {
                                    compact: true,
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
                        exclude: /\.module.css$/,
                        use: [
                            MiniCssExtractPlugin.loader,
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
                    {
                        test: /\.module.css$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            'css-modules-typescript-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                    sourceMap: true,
                                    modules: true,
                                    localIdentName: '[name]--[local]--[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    config: {
                                        path: path.join(__dirname, './postcss.config.js')
                                    },
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
                        exclude: [/\.(flow|js|jsx|ts|tsx|mjs)$/, /\.html$/, /\.json$/],
                        options: {
                            name: `[path]${fileName}.[ext]`
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
                    minify: htmlMinifyOptions,
                    template: filename
                })
        ),

        // Makes some environment variables available to the JS code.
        // It is absolutely essential that NODE_ENV was set to production here.
        // Otherwise React will be compiled in the very slow development mode.
        new webpack.DefinePlugin(env.stringified),

        // CSS extractor.
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            filename: `${fileName}.css`,
            chunkFilename: `${fileName}.chunk.css`
        }),

        // Generate a manifest file which contains a mapping of all asset filenames
        // to their corresponding output file so that tools can pick it up without
        // having to parse `index.html`.
        new ManifestPlugin({
            fileName: 'asset-manifest.json'
        }),

        // Generate a service worker script that will precache, and keep up to date,
        // the HTML & assets that are part of the Webpack build.
        new GenerateSW({
            importWorkboxFrom: 'local',
            
            cacheId: 'vitalizer-cache',

            // By default, a cache-busting query parameter is appended to requests
            // used to populate the caches, to ensure the responses are fresh.
            // If a URL is already hashed by Webpack, then there is no concern
            // about it being stale, and the cache-busting can be skipped.
            dontCacheBustUrlsMatching: /\.\w{8}\./,

            // Don't precache licenses, sourcemaps (they're large) and build asset manifest:
            exclude: [/\.LICENSE$/, /\.map$/, /asset-manifest\.json$/],

            // Sets an HTML document to use as a fallback for URLs not found in the cache.
            navigateFallback: '/index.html'
        }),

        // Custom format webpack stats output so it doesn't look shit.
        new StylishWebpackPlugin()
    ]
})
