# Welcome to the My tasks repo

## How to run the project

In the root of the repo run the following

1. `npm install`
2. `npm start`

Note that the api needs a `.env` file to run properly. This is not on the repo because it contains sensitive information. You'll need to ask for it.

This will fire up the api in the port 3000 and the client in the port 5173.

Visit http://localhost:5173/ to see the application

## Tests

### E2E tests

The e2e tests are run by Cypress. To run them, run `npm run e2e-tests`.

NOTE: Be sure to run `npm start` before running Cypress since the Cypress tests depend on the services running in your local machine.
