module.exports = {
  entry: './index',
  output: {
    publicPath: './dist/',
    path: './dist/',
    filename: 'bundle.js',
    pathinfo: true
  },
  resolve: {
    root: '.'
  },
  module: {
    loaders: [
      {test: /\.js/, loader: 'jsx-loader?harmony'}
    ]
  }
};