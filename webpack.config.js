const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const extractSass = new ExtractTextPlugin({
    filename: "[name]-[contenthash].css",
    disable: process.env.NODE_ENV === "development",
    allChunks: true
});

const  config = {
    context: path.resolve(__dirname, 'src') , // `__dirname` is root of project and `src` is source
    entry: {
        main: './index.jsx',
        styles: './styles/main.scss'
    },
    output: {
        path: path.resolve(__dirname, 'dist'), // `dist` is the destination
        publicPath: '/',
        filename: '[name].js',
    },
    // devServer: {
    //     // open: true, // to open the local server in browser
    //     contentBase: __dirname,
    // },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            'src',
            'node_modules'
        ],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, //Check for all js files
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015'] }
                }]
            },
            {
                test: /\.scss$/, //Check for sass or scss file names
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(png|jpg)$/,
                include: path.resolve(__dirname, 'src'),
                use: [{
                    loader: 'url-loader',
                    options: { limit: 10000 } // Convert images < 10k to base64 strings
                }]
            },
            {
                test  : /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                use: ['file-loader']
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject  : 'body',
            filename: 'index.html'
        }),
        extractSass
    ],
    devtool: "eval-source-map", // Default development sourcemap
};

if (process.env.NODE_ENV === "production") {
    config.devtool = "source-map";
}

module.exports = config;