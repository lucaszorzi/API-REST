const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const { application } = require("express");


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var DB = {
    games: [
        {
            id: 23,
            title: 'Call of Duty',
            year: 2009,
            price: 60
        },
        {
            id: 24,
            title: 'Grand Thieft Auto',
            year: 1998,
            price: 10
        },
        {
            id: 25,
            title: 'Cup Head',
            year: 2018,
            price: 120
        }
    ]
}

app.get('/games', (req, res) => {
    res.statusCode = 200;
    res.json(DB.games);
});

app.get("/game/:id", (req, res) => {
    if(isNaN(req.params.id))
        res.sendStatus(400);
    else {
        var id = parseInt(req.params.id);
        var game = DB.games.find(g => g.id == id);

        if(game != undefined){
            res.statusCode = 200;
            res.json(game);
        }
        else
            res.sendStatus(404);
    }
});

app.post("/game", (req, res) => {
    var { title, price, year } = req.body;

    if (title == undefined || !title || isNaN(price) || !price || isNaN(year) || !year)
        res.sendStatus(400);

    DB.games.push({
        id: 26,
        title,
        price,
        year
    });

    res.sendStatus(200);
});

app.delete("/game/:id", (req, res) => {
    if(isNaN(req.params.id))
        res.sendStatus(400);
    else {
        var id = parseInt(req.params.id);
        var index = DB.games.findIndex(g => g.id == id);

        if(index == -1)
            res.sendStatus(404);
        else {
            DB.games.splice(index, 1);
            res.sendStatus(200);
        }
    }
});

app.put("/game/:id", (req, res) => {
    if(isNaN(req.params.id))
        res.sendStatus(400);
    else {
        var id = parseInt(req.params.id);
        var game = DB.games.find(g => g.id == id);

        if(game != undefined){

            var { title, price, year } = req.body;

            if ((title == undefined || !title) && (isNaN(price) || !price) && (isNaN(year) || !year))
                res.sendStatus(400);

            
            if(title!=undefined)
                game.title = title;

            if(price!= undefined)
                if (!isNaN(price))
                    game.price = price;
                else
                    res.sendStatus(400);

            if(year!= undefined)
                if (!isNaN(year))
                    game.year = year;
                else
                    res.sendStatus(400);
            
            res.sendStatus(200);
        }
        else
            res.sendStatus(404);
    }
})

app.listen(3000, () => {
    console.log('Server is running!');
})