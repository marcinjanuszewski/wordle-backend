<p align="center"# Wordle Game API

## Description:

Your task is to develop an API for the popular word-guessing game called Wordle. The API should allow users to start a new game and submit word guesses. The objective is to build an API that can be used as the backend for a Wordle game application.

## Requirements:

Implement the following endpoints:

1. POST /game: Start a new game and receive a game ID.
   POST /game/:id/guess: Submit a word guess for a specific game.
2. The game should follow the rules of Wordle, where players guess a five-letter word, and the API provides feedback on the correctness of the guess. The feedback should include the number of correct letters in the correct positions (exact matches) and the number of correct letters in the wrong positions (partial matches).
3. The API should provide feedback on the correctness of the guess, indicating whether the guess is correct or not.
4. Implement basic validation and error handling for the API. For example, return appropriate HTTP status codes and error messages when required.
5. Include appropriate tests for your API using a testing framework of your choice (e.g., Jest, Mocha).

## Additional Guidelines:

- Focus on writing clean, modular, and maintainable code.
- Follow RESTful best practices and naming conventions.
- Use proper error handling techniques.
- Include a README file with instructions on how to set up and run the project.
- Feel free to use any Node.js libraries or frameworks you're comfortable with.
- Feel free to use any database you're comfortable with. If you choose to use a database, include instructions on how to set up and run the database.

## Evaluation Criteria:

We will assess your solution based on the following criteria:

- Correctness: Does the API meet all the requirements and work as expected?
- Code quality: Is the code well-structured, readable, and maintainable?
- Testing: Are there appropriate tests to ensure the API's functionality?
- Error handling: Does the API handle errors and edge cases effectively?

# Technicalities

## Installation

```bash
$ npm install
```

## Configuration

Available env variables:

- `NODE_ENV` - node env, ex. 'development', 'production' or 'testing'
- `APP_PORT` - app port, default is 3000
- `POSTGRES_HOST` - database host
- `POSTGRES_PORT` - database post
- `POSTGRES_USER` - database post
- `POSTGRES_PASSWORD` - database user's password
- `POSTGRES_DATABASE` - database name

- `AUTH_JWT_SECRET` - secret to generate JWT
- `AUTH_ISSUER` - issuer that will be available in
- `AUTH_JWT_EXPIRATION_IN_MINUTES` - jwt expiration time in minutes (default 10)

## App run

### Available scripts

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Running the app on docker

```bash
# prepare env variables
$ cp .env.dist .env

# run docker-compose
$ docker-compose up -d
```

### Running the app on hybrid mode

```bash
# prepare env variables
# ensure that POSTGRES_HOST is proper one (ex. 'localhost')
$ cp .env.dist .env

# run docker-compose
$ docker-compose up -d postgres

# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# integration tests
$ npm run test:integration

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Creating database migrations

If you want to create migration named as `user`, simply run this script:

```bash
npm run db:migration:generate src/core/database/migrations/user
```

## Swagger

Application supports swagger. It's available on `/api` path (ex. `http://localhost:3000/api`)`

## Stack
- typescript
- nest.js
- typeorm
- postgres
- joi
- bcrypt
- jwt and passport-jwt
- supertest, jest