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

// has mint default 0
const request = [
    'CREATE TABLE IF NOT EXISTS transactions (hash_id VARCHAR(250), type INT, holder VARCHAR(250), amount INT, price BIGINT(255), timestamp INT, token_id VARCHAR(250), PRIMARY KEY (hash_id))',
    'CREATE TABLE IF NOT EXISTS vuilders (twitter_id BIGINT, twitter_tag VARCHAR(250), twitter_name VARCHAR(250), avatar VARCHAR(250), bio VARCHAR(1000), has_mint INT, mint_hash VARCHAR(250), address VARCHAR(250), isVuilder INT, PRIMARY KEY (twitter_id))'
];

request.forEach(element =>
    database.query(element, error => {
        error ? console.log(error) : console.log(`Request successfull ${element.slice(0, 45)}`);
    })
);

database.end();
