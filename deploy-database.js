const mysql = require('mysql');
require('dotenv').config();

const option = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    port: process.env.SQL_PORT
};

if (!process.env.PRODUCTION) {
    option.socketPath = process.env.SQL_SOCKETPATH;
}

const database = mysql.createConnection(option);

/**
 * TODO: password VARCHAR lenght must be changed for production
 * TODO: delete avatar bio field
 */
const request = [
    'CREATE TABLE IF NOT EXISTS allowed_twitter(id INT NOT NULL AUTO_INCREMENT, twitter_name VARCHAR(255) NOT NULL, PRIMARY KEY(id));',
    'CREATE TABLE IF NOT EXISTS twitter_vite(twitter_id VARCHAR(100) NOT NULL, twitter_name VARCHAR(255) NOT NULL, vite_address VARCHAR(255) NOT NULL, PRIMARY KEY(twitter_id));'
];

request.forEach(element =>
    database.query(element, error => {
        error ? console.log(error) : console.log(`Request successfull ${element.slice(0, 45)}`);
    })
);

database.end();
