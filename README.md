# linkeame

A URL shortening service in Spanish.

## Install

1. Install [Node](https://nodejs.org/en/)

1. Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

1. Use this project's Node version

    ```shell
    nvm use
    ```

1. Install dependencies

    ```shell
    npm install
    ```

1. Install [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)

1. Start MongoDB in the background

    ```shell
    mongod --config /usr/local/etc/mongod.conf --fork
    ```

1. Create admin account for authentication

    ```shell
    mongo
    ```

    ```
    > use admin
    switched to db admin
    > db.createUser({
          user: "monkey",
          pwd: "password",
          roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
      })
    ```

1. Create a `.env` file in the project root, and set your environment variables

    ```shell
    cp .example.env .env
    ```

1. Start the server

    ```shell
    npm start
    ```

## Linting

[ESLint](https://eslint.org/) is configured to run automatically as a
pre-commit hook. It follows the Airbnb JavaScript Style Guide.

You can run linting manually with:

```shell
npm run lint
```

## Testing

Tests run with [Mocha](https://mochajs.org/) and code coverage is reported
with [Istanbul](https://istanbul.js.org/). Tests live under the `test/`
directory, which is Mocha's default path.

To run the test suite:

1. Create a `.env.test` file and populate with test values (see `.travis.yml`)

    ```shell
    cp .example.env .env.test
    ```

1. Run the test script

    ```shell
    npm test
    ```
