/* eslint no-console: "off" */

require('dotenv').config();
const express = require('express');

const { connectToDb } = require('./db');
const { installHandler } = require('./apiHandler');

const app = express();
const port = process.env.API_SERVER_PORT || 3000;

installHandler(app);

(async function main() {
    try {
        await connectToDb();
        app.listen(port, () => console.log(`API started on port ${port}`));
    } catch (err) {
        console.log('ERROR:', err);
    }
}());
