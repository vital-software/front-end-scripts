# Vitalizer [ ![Codeship Status for vital-software/vitalizer](https://app.codeship.com/projects/d1e97e30-f4f5-0135-8b1f-4a1efb3ae25c/status?branch=master)](https://app.codeship.com/projects/273449) [![npm version](https://badge.fury.io/js/vitalizer.svg)](https://badge.fury.io/js/vitalizer)

[![Greenkeeper badge](https://badges.greenkeeper.io/vital-software/vitalizer.svg)](https://greenkeeper.io/)
Get a Front End project up with no external configuration.

## TODO Notes
- Move `:root` statement out of common files (dashboard/checkin), and load in at root level instead (once per app)
- Update the 'babili-webpack-plugin' when https://github.com/webpack-contrib/babel-minify-webpack-plugin/issues/68 fixed

## Features
- Yarn
- HTTP/2
- HTTPS
- GZipping
- Hot reloading
- Injected JS/CSS assets
- Tree-shaking optimization
- Cache busted production assets
- Source maps


### CSS Support
- PostCSS
- Autoprefixer
- SCSS style syntax
- [cssnext](http://cssnext.io/)
- CSS Nano minification
- rem() function support


### JavaScript Support
- Babel
- ES2015
- ES2016
- ES2017
- Babili minification
- Vendor chunking


### Code Quality
- [ESLint](http://eslint.org/)
- [Stylelint](http://stylelint.io/)

#### Style property ordering
Style property order uses a version of the 'Outside In' ordering approach, with all direction properties in clockwise order (TRBL). The order is as follows:

- Position properties (`position`, `top`, `left`)
- Box model properties (`display`, `width`, `height`, `padding`, `margin`)
- Text properties (`color`, `font-family`, `line-height`)
- Visual properties (`cursor`, `background`, `border`)
- Animation & misc properties (`transform`, `animation`, `transition`)



## Configuration
If you need project specific configuration for the build/watch tasks, create a `.build.config.js` in the root folder of your project. It uses the following syntax:

```
module.exports = {
    entry: {
    }
};
```


## Troubleshooting

#### Environment variables on build
Ensure that the BUILD_ENV environment variable gets set directly before the call to build otherwise the variable will fall out of scope and be undefined in the build script context.
eg: `BUILD_ENV=production vitalizer build`

#### Safari outputs a (WebSocket network error: OSStatus Error -9807: Invalid certificate chain)
You need to ensure you've correctly trusted the self-signed certificate within Safari. See the guide [available here](http://blog.marcon.me/post/24874118286/secure-websockets-safari) for how to do this. If the padlock icon doesn't show in the URL bar, you will need to clear browser history for the `localhost` domain and refresh the page.


## Contributing

#### Running tests locally
Use the following command to run the tests on your local environment:

    yarn test
