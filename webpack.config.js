const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: {
    'lineChart': './src/lineChart/chart.js',
    'scatterplot': './src/scatterplot/chart.js',
    'barChart': './src/barChart/chart.js',
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('index.html'),
      filename: 'lineChart.html',
      title: 'lineChart',
      chunks: ['lineChart']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('index.html'),
      filename: 'scatterplot.html',
      title: 'scatterplot',
      chunks: ['scatterplot']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('index.html'),
      filename: 'barChart.html',
      title: 'barChart',
      chunks: ['barChart']
    }),
  ]
}