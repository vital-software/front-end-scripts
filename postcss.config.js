/* eslint-disable filenames/match-regex */
module.exports = (ctx) => ({
    parser: 'postcss-scss',
    // parser: ctx.sugar ? 'sugarss' : false,
    // map: ctx.env === 'development' ? ctx.map : false,
    // from: ctx.from,
    // to: ctx.to,
    plugins: {
        'postcss-import': {},
        'postcss-simple-vars': {},
        'postcss-strip-inline-comments': {}
        // cssnano: ctx.env === 'production' ? {} : false
    }
});
