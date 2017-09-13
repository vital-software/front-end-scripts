# Vitalizer [![Build Status](https://travis-ci.org/vital-software/vitalizer.svg?branch=master)](https://travis-ci.org/vital-software/vitalizer) [![npm version](https://badge.fury.io/js/vitalizer.svg)](https://badge.fury.io/js/vitalizer)

[![Greenkeeper badge](https://badges.greenkeeper.io/vital-software/vitalizer.svg)](https://greenkeeper.io/)
Get a Front End project up with no external configuration.

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
- UglifyJS minification
- Vendor chunking


### Code Quality
- [ESLint](http://eslint.org/)
- [styleLint](http://stylelint.io/)


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
