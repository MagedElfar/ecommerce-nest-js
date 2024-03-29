export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,

    uiLink: "http://http://localhost:3000",

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
    },
    cloudStorage: {
        apiKey: process.env.CLOUD_API_KEY!,
        apiSecret: process.env.CLOUD_API_SECRET!,
        cloudName: process.env.CLOUD_NAME!
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        successUrl: "http://localhost:3000/api",
        cancelUrl: "http://localhost:3000/api"
    },
    nodemailer: {
        user: process.env.GOOGLE_USER,
        password: process.env.GOOGLE_PASSWORD
    }
});