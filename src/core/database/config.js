require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        dialect: process.env.DB_DIALECT,
    },
    production: {
        username: process.env.DB_USER_PRODUCTION,
        password: process.env.DB_PASS_PRODUCTION,
        database: process.env.DB_NAME_PRODUCTION,
        host: process.env.DB_HOST_PRODUCTION,
        port: parseInt(process.env.DB_PORT_PRODUCTION),
        dialect: process.env.DB_DIALECT_PRODUCTION,
    },
}