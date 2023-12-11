export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        dialect: process.env.DB_DIALECT,
    },
    jwt: {
        secret: process.env.JWTKEY,
        exp: process.env.TOKEN_EXPIRATION
    }
});