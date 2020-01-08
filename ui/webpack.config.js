const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/app.jsx',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: 'all',
        },
    },
};
