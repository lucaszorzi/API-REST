const Sequelize = require('sequelize');
const connection = require('../database/connection');

const Games = connection.define('games', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Games.sync({ force: false });

module.exports = Games;