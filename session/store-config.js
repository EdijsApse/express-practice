const session = require('express-session');

const mongoDBStore = require('connect-mongodb-session');

const MongoDBStore = mongoDBStore(session);

const sessionStore = new MongoDBStore({
    uri: process.env.DB_URL,
    databaseName: process.env.DB_NAME,
    collection: process.env.SESSION_STORAGE_NAME
});

module.exports = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
});