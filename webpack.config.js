// vim: sw=2:paste

var webpack = require('webpack');

module.exports = {
  entry: [
    //'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    //'./src/index.js'
  ],
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel',
      // query: { presets:['react', 'es2015', 'stage-0'] }
    }]
  },
  resolve: {
    extensions: ['', '.js']
  },
  output: {
    path: 'dist2',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    hot: false
  },
  //plugins: [ new webpack.HotModuleReplacementPlugin() ]
  //plugins: [ new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } }) ]
};

