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
    discardOverridden: true,
    filterPlugins: false,
    functionOptimiser: true,
    mergeIdents: false,
    mergeLonghand: true,
    mergeRules: true,
    minifyFontValues: true,
    minifyGradients: true,
    minifyParams: true,
    minifySelectors: true,
    reduceIdents: false,
    reduceInitial: false,
    reducePositions: true,
    reduceTimingFunctions: true,
    reduceTransforms: true,
    zindex: false
}

module.exports = (context) => ({
    parser: 'postcss-scss',
    plugins: {
        'postcss-import': {},
        'postcss-simple-vars': {},
        'postcss-strip-inline-comments': {},
        'postcss-remify': {},
        precss: {},
        'postcss-cssnext': {},
        cssnano: context.env === 'production' ? CSS_NANO_OPTIONS : false
    }
})
