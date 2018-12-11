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
        'postcss-preset-env': {
            features: {
                'custom-properties': false
            }
        },
        'postcss-url':
            env === 'production' && CDN_URL
                ? {
                    url: ({ url }) => `${CDN_URL}${url}`
                }
                : false
    }
})
