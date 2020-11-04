const paths = require('../config/paths')

module.exports = {
    // Use gzip compression
    compress: true,
    // Use /static/ as the default content base
    contentBase: paths.appPublic,
    // Allow connection to HMR websocket
    disableHostCheck: true,
    // index.html will catch all routes (allowing Router to do it's thing)
    historyApiFallback: true,
    // Hot module replacement
    hot: true,
    // Allow serving externally
    host: '0.0.0.0',
    // Enable https
    https: process.env.HTTPS === 'true' ? true : false,
    // Hide the webpack bundle information
    noInfo: true,
    // Match public path with output path
    publicPath: '/',
}
