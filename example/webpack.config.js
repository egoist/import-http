const ImportHttpPlugin = require('../webpack')

module.exports = {
  mode: 'development',
  devtool: false,
  entry: __dirname + '/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'main.js'
  },
  plugins: [
    new ImportHttpPlugin({
      reload: process.env.RELOAD
    })
  ],
  stats: {
    colors: true,
    chunks: false,
    children: false,
    modules: false,
    hash: false,
    version: false,
    timings: false,
    builtAt: false
  }
}
