/* eslint-disable filenames/match-regex */
const CSS_NANO_OPTIONS = {
    autoprefixer: false,
    calc: true,
    colormin: true,
    convertValues: true,
    core: true,
    discardComments: { removeAll: true },
    discardDuplicates: true,
    discardEmpty: true,
    filterOptimiser: true,
    filterPlugins: false,
    functionOptimiser: true,
    mergeLonghand: true
}

module.exports = (context) => ({
    parser: 'postcss-scss',
    plugins: {
        'postcss-import': {},
        'postcss-simple-vars': {},
        'postcss-strip-inline-comments': {},
        'postcss-remify': {},
        'precss': {},
        'postcss-cssnext': {},
        'cssnano': context.env === 'production' ? CSS_NANO_OPTIONS : false
    }
})
