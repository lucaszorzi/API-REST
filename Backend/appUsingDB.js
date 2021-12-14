const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const { application } = require("express");
const connection = require('./database/connection');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const gamesModel = require('./models/gamesModel');
const usersModel = require('./models/usersModel');

const Auth = require('./middleware/auth');

app.use(cors()); //Para liberar o acesso externo ao consumo da API
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database connection
connection.authenticate().then(() => {
    console.log('Database working!')
}).catch(err => {
    console.log(err);
})

const JWTSecret = require("./JWTSecret");

// JWT Auth
app.post("/auth", (req, res) => {
    var { email, password } = req.body;

    if(email != undefined){
        usersModel.findOne({ where: {email: email}}).then(user => {
            if(user != undefined) {
                if(user.password == password){

                    jwt.sign({id: user.id, email: user.email}, JWTSecret, {expiresIn: '48h'}, (err, token) => {
                        if(err){
                            res.statusCode = 400;
                            res.json({err: "Falha interna."});
                        }
                        else {
                            res.statusCode = 200;
                            res.json({token: token});
                        }
                    })
                }
                else{
                    res.statusCode = 401;
                    res.json({err: "Credenciais inválidas!"})
                }
            }
            else{
                res.statusCode = 400;
                res.json({err: "Email não encontrado"});
            }
        }).catch(err => {
            res.statusCode = 500;
            res.json({err: err});
        })
    }
    else{
        res.statusCode = 400;
        res.json({err: "Email inválido!"});
    }
})



// API REST

app.get('/games', Auth, (req, res) => {

    var HATEOAS = [
        {
            href: "http://localhost:3000/game/0",
            method: "DELETE",
            rel: "delete_game"
        },
        {
            href: "http://localhost:3000/game/0",
            method: "GET",
            rel: "get_game"
        },
        {
            href:"http://localhost:3000/auth",
            method: "POST",
            rel: "login"
        }
    ]

    gamesModel.findAll().then(games => {
        res.statusCode = 200;
        res.json({games: games, _links: HATEOAS});
    }).catch(err => {
        console.error(err);
        res.sendStatus(err);
    })
});

app.get("/game/:id", Auth, (req, res) => {
    if(isNaN(req.params.id))
        res.sendStatus(400);
    else {
        var id = parseInt(req.params.id);
        gamesModel.findOne({ where: {id: id}}).then(game => {
            if(game != undefined){
                res.statusCode = 200;

                var HATEOAS = [
                    {
                        href: "http://localhost:3000/game/"+id,
                        method: "DELETE",
                        rel: "delete_game"
                    },
                    {
                        href: "http://localhost:3000/game/"+id,
                        method: "GET",
                        rel: "get_game"
                    },
                    {
                        href:"http://localhost:3000/game/"+id,
                        method: "PUT",
                        rel: "edit_game"
                    },
                    {
                        href:"http://localhost:3000/auth",
                        method: "POST",
                        rel: "login"
                    }
                ]

                res.json({game, _links: HATEOAS});
            }
            else
                res.sendStatus(404);
        }).catch(err => {
            console.error(err);
            res.sendStatus(err);
        })
    }
});

app.post("/game", Auth, (req, res) => {
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

app.delete("/game/:id", Auth, (req, res) => {
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

app.put("/game/:id", Auth, (req, res) => {
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