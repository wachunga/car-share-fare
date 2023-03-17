# car-share-fare

[![CircleCI](https://circleci.com/gh/wachunga/car-share-fare.svg?style=svg)](https://circleci.com/gh/wachunga/car-share-fare)

Knowing which car share to use in Vancouver ([the car share capital of North America](https://www.cbc.ca/news/canada/british-columbia/vancouver-car-share-car2go-evo-1.4504926)) is non-trivial. This tool aims to help by making it easy to compare costs.

Try it out at https://carshare.now.sh

## Supported services

- [Evo](https://evo.ca) - one-way carsharing company
- [Lyft](https://www.lyft.com/rider/cities/vancouver-bc) - ridesharing company
- [Modo](https://modo.coop) - two-way carsharing co-operative

## Development

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

### Making a new release

- Update [CHANGELOG.md](./CHANGELOG.md) and commit that.
- Run `npm version <patch/minor/major>` (this updates package.json and creates a tag).
- Run `git push --tags`.

### `npm start`

Start the app.

### `npm run build`

Bundles the package (using Rollup) and copies static assets to the `dist` folder.

Use `build:watch` during development to watch for changes.

### `npm test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

### Deployment

Each build is deployed to https://carshare.now.sh with [now](https://zeit.co/now). The configuration lives in `now.json`.
