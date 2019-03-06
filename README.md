# cypress-watch-and-reload

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

## Details

This plugin opens a WebSocket connection from Cypress to its Node backend. The backend is watching [index.html](index.html) file. Whenever you change and save the [index.html](index.html) file, Cypress will notice and will reload itself, rerunning tests.

## License

MIT license
