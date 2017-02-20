# Front End Scripts
Get a Front End project up with no external configuration

## Features
- Yarn
- HTTP/2
- HTTPS
- GZipping
- Hot reloading
- Injected JS/CSS assets
- Tree-shaking optimisation
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

#### Safari outputs a (WebSocket network error: OSStatus Error -9807: Invalid certificate chain)
You need to ensure you've correctly trusted the self-signed certificate within Safari. See the guide [available here](http://blog.marcon.me/post/24874118286/secure-websockets-safari) for how to do this. If the padlock icon doesn't show in the URL bar, you will need to clear browser history for the `localhost` domain and refresh the page.
