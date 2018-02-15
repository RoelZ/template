// This configuration is meant as template for Not on Paper projects
// It's configured to work with Laravel / October / Twig / Vue based projects out-of-the-box
// It's based on an article by nirjhor (https://medium.com/@nirjhor123/webpack-3-quickstarter-configure-webpack-from-scratch-30a6c394038a)

const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');         // for customizing webpacks defaults (https://webpack.js.org/plugins/extract-text-webpack-plugin)
const HtmlWebpackPlugin = require('html-webpack-plugin');           // adding onchange support (https://webpack.js.org/loaders/css-loader)
const ExtractTextPlugin = require('extract-text-webpack-plugin');   // adding text extraction to get CSS out of JS
const webpack = require('webpack');

const extractPlugin = new ExtractTextPlugin({ filename: './assets/css/app.css' });

const config = {

    // Output path using nodeJs path module
    context: path.resolve(__dirname, 'src'),

    entry: {
        app: './app.js'                                             // removed 'src' directory from entry point, since 'context' is taken care of that
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './assets/js/[name].bundle.js'
    },

    module: {
        rules: [

            // babel-loader
            {
                test: /\.js$/,
                include: /src/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['env']
                    }
                }
            },

            // html-loader
            /*
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            */
            // twig-loader
            {
                test: /\.twig$/,
                include: [
                    path.resolve(__dirname, './src/layouts'),
                    path.resolve(__dirname, './src/pages'),
                    path.resolve(__dirname, './src/partials')
                ],
                loader: 'twig-loader'
            },

            // sass-loader
            {
                test: /\.scss$/,
                include: [path.resolve(__dirname, 'src', 'assets', 'scss')],
                use: extractPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',                   // https://webpack.js.org/loaders/css-loader
                            options: {
                                sourceMap: true                     // 'unminifies' (s)css for debugging purposes (line number)
                            }
                        },
                        {
                            loader: 'sass-loader',                  // https://webpack.js.org/loaders/sass-loader/
                            options: {
                                sourceMap: true                     // 'unminifies' (s)css for debugging purposes (line number)
                            }
                        }
                    ],
                    fallback: 'style-loader'                        // https://webpack.js.org/loaders/style-loader/
                })
            },

            // file-loader (for images)
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            //publicPath: './src/assets/media/',
                            outputPath: './assets/media/'
                        }
                    }
                ]
            },

            //file-loader(for fonts)
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            }
        ]
    },
    node: {
      fs: 'empty'                                                   // avoiding error messages (recommended by twig-loader)
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),                           // for emptying 'dist'
        new HtmlWebpackPlugin({
            template: './layouts/base.html.twig'
        }),
        extractPlugin
    ],
    devServer: {
        contentBase: path.resolve(__dirname, './dist/assets/media'),
        stats: 'errors-only',
        open: true,
        port: 12000,
        compress: true
    },
    devtool: ' inline-source-map'
}

module.exports = config;