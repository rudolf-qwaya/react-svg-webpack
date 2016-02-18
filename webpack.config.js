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
                    presets: ['react']
                }
            },
            {test: /\.css$/, loader: "style!css"}
        ]
    },
    devServer: {
    },
    output: {
        filename: "bundle.js"
    }
};
module.exports = config;
