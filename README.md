# Vitalizer [![Build status](https://badge.buildkite.com/06a3e85c8806f7f481e77bc9c9905f967c5c68dfd5aceb69c5.svg)](https://buildkite.com/vital/vitalizer)

Webpack development and bundling tool for Vital.

### Features

- Hot reloading
- Injected JS/CSS assets
- Tree-shaking optimization
- Cache busted production assets
- Source map support
- PostCSS (Autoprefixer, SCSS style syntax)
- CSS Module support
- cssnano minification
- rem() function support
- Bundle Analyzer support

### Contributing

All changes that are pushed to the master branch are deployed via a Buildkite pipeline. The pipeline runs tests, builds a Docker image, builds the release artifacts for NPM, and the library itself to an NPM registry. Use the Commit Message as documented in our [Contributing Guide](https://github.com/vital-software/components/blob/master/CONTRIBUTING.md#npm-via-semantic-release) to trigger a release.

### Installing

To install, run the following commands:

```
yarn add vitalizer -D
```

### Usage

**Development**

To run Vitalizer in development mode (using webpack-serve), run the following command:

```sh
vitalizer start
```

To build your project files for production, run the following command:

```sh
vitalizer build
```

### Configuration

To configure Vitalizer, create a file called `.vitalizer` in the root of your project:

```
VARIABLE=name
```

And set any of the following variables:

| Variable                | Development            | Production         | Usage                                                                                                                                                                               |
| :---------------------- | :--------------------- | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BUILD_DIR`             | :x:                    | :white_check_mark: | Output directory to build files to. Defaults to `public`.                                                                                                                           |
| `BUNDLE_ANALYZER_TOKEN` | :x:                    | :white_check_mark: | If specified, on build webpack will upload a summary of production bundle sizes to bundle-analyzer                                                                                  |
| `CDN_URL`               | :x:                    | :white_check_mark: | When set, production assets are output as `[CDN_URL][asset]` rather than `[asset]`. Used to support an external CDN for assets.                                                     |
| `CI`                    | :large_orange_diamond: | :white_check_mark: | When set to `true`, Vitalizer treats warnings as failures in the build. Most CIs set this flag by default.                                                                          |
| `DISABLE_HASH`.         | :x:                    | :white_check_mark: | When set to `true`, production assets are output as `[name].[ext]` rather than `[name][hash].[ext]`. Useful for debugging and test purposes.                                        |
| `HOST`                  | :white_check_mark:     | :x:                | By default, the development web server binds to `localhost`. You may use this variable to specify a different host.                                                                 |
| `HTTPS`                 | :white_check_mark:     | :x:                | When set to true, will enable https on the dev server. The certificate will be self signed, so will show a warning in the browser. Defaults to `false`                              |
| `INDEX_FILES`           | :white_check_mark:     | :white_check_mark: | Comma seperated list of HTML files to use. Defaults to `static/index.html`.html`.                                                                                                   |
| `PORT`                  | :white_check_mark:     | :x:                | By default, the development web server will attempt to listen on port 3000 or prompt you to attempt the next available port. You may use this variable to specify a different port. |
| `RESOLVE_MODULES`       | :white_check_mark:     | :white_check_mark: | Comma seperated list of module roots to use other than `node_modules`. i.e. `app, static`                                                                                           |
| `WEBPACK_STATS`         | n/a                    | :x:                | When set to any value, on build webpack will write build statistics JSON to stats.json in the output directory                                                                      |

We also support overriding the **Webpack Dev Server** settings by creating a `serve.config.dev.js` file in your project root, and using [applicable Webpack Dev Server config syntax](https://webpack.js.org/configuration/dev-server/).

#### Expanding Environment Variables In .env

Expand variables already on your machine for use in your `.env` file (using [dotenv-expand](https://github.com/motdotla/dotenv-expand)).

For example, to use the `DOMAIN` variable:

```
DOMAIN=www.example.com
FOO=$DOMAIN/foo
BAR=$DOMAIN/bar
```
