var config = {
    context: __dirname + "/app",
    entry: "./main.js",
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {test: /\.css$/, loader: "style!css"}
        ]
    },
    devServer: {
        proxy: {
            '/api/*': {
                target: 'http://localhost:8081',
                secure: false
            }
        }
    },
    output: {
        filename: "bundle.js"
    }
};
module.exports = config;
