const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    context: path.join(__dirname, 'src'),
    entry: './index.ts',
    output: {
        path: path.resolve(__dirname, 'demo'),
        filename: 'index.js',
        clean: true
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            {
                test: /\.(wgsl|glsl)/,
                exclude: /node_modules/,
                type: 'asset/source'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Terrain Renderer',
            template: path.join(__dirname, 'src', 'index.html'),
            filename: 'index.html',
            inject: 'body'
        })
    ],
    devServer: {
        // for webgpu
        https: true
    }
};
