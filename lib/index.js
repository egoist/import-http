module.exports = {
  get WebpackPlugin() {
    return require('./webpack')
  },
  get rollupPlugin() {
    return require('./rollup')
  }
}
