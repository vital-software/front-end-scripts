# Vitalizer [![Build status](https://badge.buildkite.com/06a3e85c8806f7f481e77bc9c9905f967c5c68dfd5aceb69c5.svg)](https://buildkite.com/vital/vitalizer) [![npm version](https://badge.fury.io/js/vitalizer.svg)](https://badge.fury.io/js/vitalizer)

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

| Variable          | Development            | Production         | Usage                                                                                                                                                                               |
| :---------------- | :--------------------- | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CDN_URL`         | :x:                    | :white_check_mark: | When set, production assets are output as `[CDN_URL][asset]` rather than `[asset]`. Used to support an external CDN for assets.                                                     |
| `CI`              | :large_orange_diamond: | :white_check_mark: | When set to `true`, Vitalizer treats warnings as failures in the build. Most CIs set this flag by default.                                                                          |
| `DISABLE_HASH`.   | :x:                    | :white_check_mark: | When set to `true`, production assets are output as `[name].[ext]` rather than `[name][hash].[ext]`. Useful for debugging and test purposes.                                        |
| `HOST`            | :white_check_mark:     | :x:                | By default, the development web server binds to `localhost`. You may use this variable to specify a different host.                                                                 |
| `INDEX_FILES`     | :white_check_mark:     | :white_check_mark: | Comma seperated list of HTML files to use. Defaults to `static/index.html`.                                                                                                         |
| `PORT`            | :white_check_mark:     | :x:                | By default, the development web server will attempt to listen on port 3000 or prompt you to attempt the next available port. You may use this variable to specify a different port. |
| `RESOLVE_MODULES` | :white_check_mark:     | :white_check_mark: | Comma seperated list of module roots to use other than `node_modules`. i.e. `app, static`                                                                                           |

#### Expanding Environment Variables In .env

Expand variables already on your machine for use in your `.env` file (using [dotenv-expand](https://github.com/motdotla/dotenv-expand)).

For example, to use the `DOMAIN` variable:

```
DOMAIN=www.example.com
FOO=$DOMAIN/foo
BAR=$DOMAIN/bar
```
