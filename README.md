# cypress-watch-and-reload

Install dependencies and open Cypress

```shell
npm install
npx cypress open
```

It should open a WebSocket connection from Cypress to its Node backend. The backend is watching [index.html](index.html) file. Whenever you change and save the [index.html](index.html) file, Cypress will notice and will reload itself, rerunning tests.
