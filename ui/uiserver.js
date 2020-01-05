require('dotenv').config();

const express = require('express');
const proxy = require('http-proxy-middleware');
const app = express();

const port = process.env.UI_SERVER_PORT || 8000;
const apiProxyTarget = process.env.API_PROXY_TARGET;
const UI_API_ENDPOINT = process.env.UI_API_ENDPOINT || 'http://localhost:3000/graphql';
const env = { UI_API_ENDPOINT };


// This will return the given response instead of the env.js file in the public folder.
// Effectively, allowing the UI to fetch the environment from the server without any
// explicit call in the code
app.get('/env.js', (req, res) => {
    res.send(`window.ENV = ${JSON.stringify(env)}`);
})

app.use(express.static('public'));

if (apiProxyTarget) {
    app.use('/graphql', proxy({ target: apiProxyTarget }));
}

app.listen(port, () => console.log(`UI started on port ${port}`));
