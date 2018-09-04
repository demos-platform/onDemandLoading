const webpack = require('webpack')
const path = require('path')

const rootPath = path.resolve(__dirname)

webpack({
  entry: path.resolve(rootPath, 'src', 'index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(rootPath, 'output'),
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: "babel-loader",
    }]
  },
}, (err, stats) => {
  console.log(err)
})