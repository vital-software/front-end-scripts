### NPM via Semantic Release

We use [Semantic Release](https://github.com/semantic-release/semantic-release) to manage releases of the Component Library to the NPM Registry.

By following the commit message template below, Semantic Release can determine what version number the next release should be.

```
Tag: Short description (fixes #1234)

Longer description here if necessary
```

The `Tag` should be replaced with one of the following:

- `Fix` - for a bug fix.
- `Update` - either for a backwards-compatible enhancement or for a rule change that adds reported problems.
- `New` - implemented a new feature.
- `Breaking` - for a backwards-incompatible enhancement or feature.
- `Docs` - changes to documentation only.
- `Build` - changes to build process only.
- `Upgrade` - for a dependency upgrade.
- `Chore` - for refactoring, adding tests, etc. (anything that isn’t user-facing).

Each of these tags corresponds to either a `Major`, `Minor` or `Patch` release.

**Note:** Only the squashed merge commit into `master` needs to follow this commit template.

