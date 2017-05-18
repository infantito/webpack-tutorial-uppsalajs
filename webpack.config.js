'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PRODUCTION = process.env.NODE_ENV === 'production';

const entry = PRODUCTION 
              ? [ './src/index.js' ]
              : [
                  './src/index.js',
                  'webpack/hot/dev-server',
                  'webpack-dev-server/client?http://localhost:8080'
                ];

const plugins = PRODUCTION
                ? [
                    new webpack.optimize.UglifyJsPlugin(/*{
                      comments: true, // By default false for delete comments and minify
                      mangle: false, // By default false, Keep the sentences names
                      compress: {
                        warnings: true
                      }
                    }*/),
                    new ExtractTextPlugin('styles-[contenthash:10].css'),
                    new HTMLWebpackPlugin({
                      template: 'index-template.html'
                    })
                  ]
                : [ new webpack.HotModuleReplacementPlugin() ];

plugins.push(
  new webpack.DefinePlugin({
    DEVELOPMENT: JSON.stringify(DEVELOPMENT),
    PRODUCTION: JSON.stringify(PRODUCTION)
  })
);

const cssIdentifier = PRODUCTION ? '[hash:base64:10]' : '[path][name]--[local]';
const cssLoader = PRODUCTION 
      ? ExtractTextPlugin.extract({
          use: 'css-loader?localIdentName=' + cssIdentifier
        })
      : [ 'style-loader', 'css-loader?localIdentName=' + cssIdentifier ];

module.exports = {
  devtool: 'source-map',
  entry: entry,
  plugins: plugins,
  module: {
    rules: [{
      test: /\.js$/,
      use: [ 'babel-loader' ],
      exclude: '/node_modules/'
    }, {
      test: /\.(png|jpg|jpeg|gif|svg)$/,
      // use: [ 'file-loader' ],
      use: [ 'url-loader?limit=10000&name=images/[hash:12].[ext]' ],
      exclude: '/node_modules/'
    }, {
      test: /\.css$/,
      use: cssLoader,
      exclude: '/node_modules/'
    }]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: PRODUCTION ? './' : '/dist/',
    filename: PRODUCTION ? 'bundle.[hash:12].min.js' : 'bundle.js'
  }
}