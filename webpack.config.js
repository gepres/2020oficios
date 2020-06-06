const path = require("path")
const miniCssExtractPlugin = require("mini-css-extract-plugin")
const webpack = require("webpack")

module.exports = {
  entry: './src/public/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, "./src/public/dist")
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test:/\.(sa|sc|c)ss$/,
        use:[
          miniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins:[
    new miniCssExtractPlugin({
      filename:'main.css'
    })
  ]
}
