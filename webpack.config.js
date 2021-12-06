const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: {
    'lineChart': './lineChart/chart.js'
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('index.html'),
      filename: 'lineChart.html',
      title: 'lineChart'
    }),
  ]
}