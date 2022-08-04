# Northcoders House of Games API

This is a backend API for Northcoders House of Games database, which is a database of popular board games. This API allows users to get reviews, post reviews and post comments on reviews. 
It also features a voting system and filtering/sorting.

[The app is hosted via Heroku which can be viewed here](https://matts-nc-games.herokuapp.com/API/)

---
## Main Endpoints

For a full list of endpoints, visit the hosted site as above. 

- **/API/**
    - Lists all available endpoints, methods and queries
- **/API/CATEGORIES**
    - Lists all available categories.
- **/API/REVIEWS**
    - Lists all reviews
        - **/:review_id**
            - Filters down to a single review when given a number (review_id).
        - **/:review_id/COMMENTS**
            - Lists comments for the filtered review_id
- **/API/USERS**
    - Lists all users

---
## Running the API

### Cloning the database

To clone this repo type the following command into your terminal.
> git clone https://github.com/MattArwenLangham/NC-Games.git

### Dependencies

This app utilises the express package which can be installed with the command:

> npm i express

The database is built on postgres with the postgres-format extension.

> npm i pg

> npm i pg-format

### Dev Dependencies

To connect to the included databases, install the dotenv package.

> npm i dotenv

This will allow you to set up .env files which will be detailed below.

*If testing is required, it is achieved by jest, jest-extended and supertest which are set up similar to the above npm i [package name].*

---
## Initial Setup and Seeding

### Environments

For testing we need to create two environments, development and test which will be automatically set dependent on whether the database is being tested or not.

For this to work, create a file called **.env.development** and **.env.test** in the root directory. 

Inside these files you want to specify the database you want to use, in this case the two databases used are nc_games and nc_games_test respectively.

*.env.development file*
> PGDATABASE=nc_games

*.env.test file*
> PGDATABASE=nc_games_test

*PLEASE NOTE: If you're planning on using this source code, remember to add these files to the .gitignore utilising '.env.\*'*

### Seeding
The two scripts required for the setup and seeding of the relevent databases are "setup-dbs" and "seed" which can be run by the following:

> npm run setup-dbs
> npm run seed

---
## Testing
The testing is done via jest. As mentioned in the Dev Dependencies section, if you wish to test, you will need to install the following packages.
1. jest
2. jest-extended
3. supertest

To run tests simply type the below in the terminal.

> npm run t

[More information on the jest package](https://jestjs.io/docs/getting-started)

---
## Version requirements
Please ensure the following packages are at least a minumum version of:

[Postgres](https://www.postgresql.org/):   8.0   (required for pooling)
[node.js](https://nodejs.org/en/):    12.0  (required for dotenv)

Please visit their websites and documentation for more information.