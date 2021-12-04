import mysql, { ConnectionConfig, MysqlError, Connection } from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

const option: ConnectionConfig = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    port: Number(process.env.SQL_PORT)
};

if (!process.env.PRODUCTION) {
    option.socketPath = process.env.SQL_SOCKETPATH;
}

/**
 * Create a new connection to the database
 * @returns connection to the database
 */
export const Connect = async () => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(option);

        connection.connect((error: MysqlError) => {
            if (error) {
                console.log(error);
                reject(error);
                return;
            }
            resolve(connection);
        });
    });
};

/**
 * Query the database once, return the result then close the connection
 * @param connection object from the Connect function
 * @param query the sql query to execute
 * @param values the values to bind to the query
 * @returns result of the query
 */
export const Query = async (connection: Connection, query: string, values?: string[]) => {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (error: any, result: any[]) => {
            if (error) {
                console.log(error);
                reject(error);
                return;
            }
            resolve(result);
            connection.end();
        });
    });
};

/**
 * Query the database once, return the result but do not close the connection after.
 *
 * NOTE: Connection must be closed manually with EndConnection function
 * @param connection object from the Connect function
 * @param query the sql query to execute
 * @param values the values to bind to the query
 * @returns result of the query
 */
export const MutlipleQuery = async (connection: Connection, query: string, values?: string) => {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (error: any, result: any) => {
            if (error) {
                console.log(error);
                reject(error);
                return;
            }
            resolve(result);
        });
    });
};

/**
 * End a mysql connection
 * @param connection object from the Connect function
 */
export const EndConnection = (connection: Connection) => {
    connection.end();
};
