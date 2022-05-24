const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.DB_URL);

let db;

async function createConnection() {
    await client.connect();

    db = client.db(process.env.DB_NAME);
}

function getDb() {
    if (!db) {
        throw { message: 'Database connection not established!'};
    }

    return db;
}

module.exports = {
    getDb,
    createConnection
}