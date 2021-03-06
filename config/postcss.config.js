const CDN_URL = process.env.CDN_URL

module.exports = ({ env }) => ({
    parser: 'postcss-scss',
    plugins: {
        'postcss-import': {},
        'postcss-simple-vars': {},
        'postcss-strip-inline-comments': {},
        'postcss-remify': {},
        'postcss-nesting': {},
        'postcss-nested': {},
        'postcss-color-function': {},
        'postcss-preset-env': {
            features: {
                'custom-properties': false
            },
            stage: 1
        },
        'postcss-url':
            env === 'production' && CDN_URL
                ? {
                    url: ({ url }) => `${CDN_URL}${url}`
                }
                : false
    }
})
