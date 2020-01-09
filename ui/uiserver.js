/* eslint no-console: "off" */

require('dotenv').config();
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

const port = process.env.UI_SERVER_PORT || 8000;
const apiProxyTarget = process.env.API_PROXY_TARGET;
const UI_API_ENDPOINT = process.env.UI_API_ENDPOINT || 'http://localhost:3000/graphql';
const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true';
const env = { UI_API_ENDPOINT };

if (enableHMR && (process.env.NODE_ENV !== 'production')) {
    /* eslint global-require: "off" */
    /* eslint import/no-extraneous-dependencies: "off" */
    console.log('Adding dev middleware, enabling HMR');
    const webpack = require('webpack');
    const devMiddleware = require('webpack-dev-middleware');
    const hotMiddleware = require('webpack-hot-middleware');
    const config = require('./webpack.config');
    config.entry.app.push('webpack-hot-middleware/client');

    config.plugins = config.plugins || [];
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    const compiler = webpack(config);
    app.use(devMiddleware(compiler));
    app.use(hotMiddleware(compiler));
}


// This will return the given response instead of the env.js file in the public folder.
// Effectively, allowing the UI to fetch the environment from the server without any
// explicit call in the code
app.get('/env.js', (req, res) => {
    res.send(`window.ENV = ${JSON.stringify(env)}`);
});

app.use(express.static('public'));

if (apiProxyTarget) {
    app.use('/graphql', proxy({ target: apiProxyTarget }));
}

app.listen(port, () => console.log(`UI started on port ${port}`));
