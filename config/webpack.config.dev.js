const path = require('path')
const paths = require('./paths')

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/'

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

        // This is the URL that app is served from. We use "/" in development.
        publicPath: publicPath,

        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    },

    resolve: {
        alias: {
            'webpack-hot-client/client': path.join(__dirname, '../node_modules/webpack-hot-client/client')
        }
    }
}
