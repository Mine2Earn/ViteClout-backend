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
const request = [];

request.forEach(element =>
    database.query(element, error => {
        error ? console.log(error) : console.log(`Request successfull ${element.slice(0, 35)}`);
    })
);

database.end();
