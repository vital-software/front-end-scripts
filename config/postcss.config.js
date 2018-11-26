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
        'postcss-cssnext': {
            features: {
                autoprefixer: {
                    flexbox: false,
                    grid: false
                    // remove: false // Enable for 10% performance improvement
                },
                customProperties: false
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
