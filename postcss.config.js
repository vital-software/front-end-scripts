/* eslint-disable filenames/match-regex */
const BROWSER_SUPPORT = [
    'Chrome >= 54',
    'ChromeAndroid >= 54',
    'Safari >= 9',
    'iOS >= 9',
    'Firefox >= 48',
    'Explorer >= 11',
    'Opera >= 40'
];

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
};

module.exports = (context) => ({
    parser: 'postcss-scss',
    plugins: {
        'postcss-import': {},
        'postcss-simple-vars': {},
        'postcss-strip-inline-comments': {},
        'postcss-remify': {},
        'precss': { browsers: BROWSER_SUPPORT },
        'postcss-cssnext': { browsers: BROWSER_SUPPORT },
        'cssnano': context.env === 'production' ? CSS_NANO_OPTIONS : false
    }
});
