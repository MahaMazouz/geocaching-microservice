# geocaching-microservice

## Description

A Geocaching Microservice API based on [Fastify](https://www.fastify.io/)
and [Redis](https://redis.io/) 

## Architectural Overview

![alt text](https://cdn-images-1.medium.com/max/800/1*nQm3_qIl8XwWIajQ8BGFSg.png)

## Stack


* [Node js](https://nodejs.org/en/)
* [Fastify](https://www.fastify.io/)
* [fastify-autoload](https://github.com/fastify/fastify-autoload)
* [Redis](https://redis.io/) 

## Feature

| Feature                                | Summary                                                                                                                                                                                                                                                     |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Pre-commit hooks           | Runs lint and tests before any commit is made locally, making sure that only tested and quality code is committed
| Code Linting               			 | JavaScript code linting is done using [ESLint](http://eslint.org) - a pluggable linter tool for identifying and reporting on patterns in JavaScript.                                                                                           |
| Auto server restart                  	 | Restart the server using [nodemon](https://github.com/remy/nodemon) in real-time anytime an edit is made, with babel compilation and eslint.                                                                                                                                                                            |
| Uses [yarn](https://yarnpkg.com) over npm            | Uses new released yarn package (Recommended). You can read more about it [here](https://yarnpkg.com/) |


## Getting Started

### Requirements

Node 8 or greater is required.


1. Clone this project
2. Run `yarn install` from root directory


## Setup

### Prerequisites

* Redis. Reffer to [official documentation](https://redis.io/) for intructions.
* Node.  Reffer to [official documentation](https://nodejs.org/en/download/) for intructions.

### Installation

```bash
$ yarn
```

### Start local server

start redis master and slave server's

```bash
$ cd scripts

$ docker-compose up

```

start fastify server

```bash
$ yarn start
```

## Documentation

[`api documentation`](https://documenter.getpostman.com/view/2425380/SzS7Q6YY?version=latest)

## Directory layout

- [`adaptars`](./src/adaptars): files responsible for making the connections to the outside world. Maps Api and Redis
- [`controllers`](./src/controllers): controllers functions tied as the route handlers.
- [`routes`](./src/routes): api routes
- [`validations`](./src/validations): as the name suggests, the validation logic for our routes will be handled here
- [`utils`](./src/utils): utility functions(http-client, crypto, moment, aws, etc.) will be wrapped here.



## License

 [MIT licensed](./LICENSE).

