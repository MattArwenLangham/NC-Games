# Northcoders House of Games API

## Dependencies

This app utilises the express package which can be installed with the command:

> npm i express

The database is built on postgres with the postgres-format extension.

> npm i pg

> npm i pg-format

## Dev Dependencies

To connect to the included databases, install the dotenv package.

> npm i dotenv

There are two environments, development and test which are set automatically dependent on whether the database is being tested or not, so set the .env files accordingly.

The two scripts required for the setup and seeding of the relevent databases are "setup-dbs" and "seed" which can be run by typing in:

> npm run setup-dbs

*If testing is required, it is achieved by jest, jest-extended and supertest.*