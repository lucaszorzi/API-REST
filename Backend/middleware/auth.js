const jwt = require('jsonwebtoken');
const JWTSecret = require("../JWTSecret");

function Auth(req, res, next) {
    const authToken = req.headers['authorization'];
    
    if(authToken != undefined){
        const [bearer, token] = authToken.split(' ');

        jwt.verify(token, JWTSecret, (err, data) => {
            if(!err) {
                req.token = token;
                req.loggedUser = {id: data.id, email: data.email};
                next();
            }
            else {
                res.statusCode = 401;
                res.json({err: "Token inválido"});        
            }
        })
    }
    else{
        res.statusCode = 401;
        res.json({err: "Token inválido"});
    }
}

module.exports = Auth;