/* eslint no-console: "off" */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const dbUrl = process.env.DB_URL || 'mongodb://localhost/issuetracker';

let db;

async function connectToDb() {
    const client = new MongoClient(dbUrl, { useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB at', dbUrl);
    db = client.db();
}

async function getNextSequence(name) {
    const result = await db.collection('counters').findOneAndUpdate(
        { _id: name },
        { $inc: { current: 1 } },
        { returnOriginal: false },
    );
    return result.value.current;
}

function getDb() {
    return db;
}

module.exports = { connectToDb, getNextSequence, getDb };
