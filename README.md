# Project

This project is an API REST built with Node.js, using Express and MySQL (with Sequelize).


## You can

`GET` a list of all Games in the database,
`POST` new games,
`GET` a single game,
`DELETE` a game from the list or
`EDIT` the information of a game.


## Run

Run `npm i` in the root folder to install all packages.

Make sure you have MySQL installed in your computer and change the `database/connection.js` file with your authentication.

Then run `nodemon appUsingDB.js` to run the application.

The server backend will run in the URL `http://localhost:3000/`

Open the `Frontend/index.html` to see the API being consumed.