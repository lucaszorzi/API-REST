const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const { application } = require("express");
const connection = require('./database/connection');
const cors = require('cors');

const gamesModel = require('./models/gamesModel');

app.use(cors()); //Para liberar o acesso externo ao consumo da API
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database connection
connection.authenticate().then(() => {
    console.log('Database working!')
}).catch(err => {
    console.log(err);
})



// API REST

app.get('/games', (req, res) => {
    gamesModel.findAll().then(games => {
        res.statusCode = 200;
        res.json(games);
    }).catch(err => {
        console.error(err);
        res.sendStatus(err);
    })
});

app.get("/game/:id", (req, res) => {
    if(isNaN(req.params.id))
        res.sendStatus(400);
    else {
        var id = parseInt(req.params.id);
        gamesModel.findOne({ where: {id: id}}).then(game => {
            if(game != undefined){
                res.statusCode = 200;
                res.json(game);
            }
            else
                res.sendStatus(404);
        }).catch(err => {
            console.error(err);
            res.sendStatus(err);
        })
    }
});

app.post("/game", (req, res) => {
    var { title, price, year } = req.body;

    if (title == undefined || !title || isNaN(price) || !price || isNaN(year) || !year)
        res.sendStatus(400);

    gamesModel.create({ title, price, year }).then(() => {
        res.sendStatus(200);
    }).catch(err => {
        console.error(err);
        res.sendStatus(err);
    })
});

app.delete("/game/:id", (req, res) => {
    if(isNaN(req.params.id))
        res.sendStatus(400);
    else {
        var id = parseInt(req.params.id);
        gamesModel.destroy({ where: {id: id} }).then(() => {
            res.sendStatus(200);
        }).catch(err => {
            console.error(err);
            res.sendStatus(err);
        })
    }
});

app.put("/game/:id", (req, res) => {
    if(isNaN(req.params.id))
        res.sendStatus(400);
    else {
        
        var id = parseInt(req.params.id);
        var { title, price, year } = req.body;

        if(price != undefined)
            if(isNaN(price))
                res.sendStatus(400);
        
        if(year != undefined)
            if(isNaN(year))
                res.sendStatus(400);

        gamesModel.update({ title, price, year }, { where: {id:id}}).then(() => {
            res.sendStatus(200);
        }).catch(err => {
            console.error(err);
            res.sendStatus(err);
        })

    }
});


//Server
app.listen(3000, () => {
    console.log('Server is running!');
});