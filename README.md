# cypress-watch-and-reload [![CircleCI](https://circleci.com/gh/bahmutov/cypress-watch-and-reload.svg?style=svg)](https://circleci.com/gh/bahmutov/cypress-watch-and-reload)

> Reloads Cypress when one of the watched files changes

## Use

```shell
npm install cypress-watch-and-reload
```

Add to your `cypress/plugins/index.js` file

```js
require('cypress-watch-and-reload/plugins')
```

Add to your `cypress/support/index.js` file

```js
require('cypress-watch-and-reload/support')
```

In your `cypress.json` set wildcard with files to watch. For example

```json
{
  "cypress-watch-and-reload": {
    "watch": "page/*"
  }
}
```

Every time you change one of the files matching the wildcard, Cypress will reload itself, rerunning the tests.

## Example

See project [cypress-watch-and-reload-example](https://github.com/bahmutov/cypress-watch-and-reload-example)

## Details

This plugin opens a WebSocket connection from Cypress to its Node backend. The backend is watching [index.html](index.html) file. Whenever you change and save the [index.html](index.html) file, Cypress will notice and will reload itself, rerunning tests.

## License

MIT license
