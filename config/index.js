const config = {
    dev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 8080,
    cors: process.env.CORS,
    database: process.env.TYPE_DB
}

const mongoDb = {
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    host: process.env.MONGODB_HOST,
    database: process.env.MONGODB_DATABASE,
}

module.exports = { 
    config,
    mongoDb 
}