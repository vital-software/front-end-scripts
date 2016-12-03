const path = require('path');

const PATH_DESTINATION = path.join(__dirname, './public/asset/build');
const PATH_SOURCE = path.join(__dirname, './client');
const PATH_SOURCE_JS = `${PATH_SOURCE}/js`;
const FILE_ENTRY = `${PATH_SOURCE_JS}/app.js`;

const DEFAULT_OPTIONS = {
    dev: true
}

module.exports = function(options = DEFAULT_OPTIONS) {
    const { dev } = options;

    return {
        // devtool: dev ? 'cheap-module-eval-source-map' : 'hidden-source-map',

        entry: {
            main: FILE_ENTRY
        },

        output: {
            path: PATH_DESTINATION,
            filename: '[name].js'
        },

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                },
            ]
        },

        resolve: {
            modules: [
                PATH_SOURCE_JS,
                'node_modules'
            ],
        }
    }
}
