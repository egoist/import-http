const path = require('path')
const util = require('util')
const webpack = require('webpack')
const HttpImport = require('..')

jest.setTimeout(30000)

test('main', async () => {
  const compiler = webpack({
    mode: 'development',
    devtool: false,
    entry: path.join(__dirname, 'fixture/entry.js'),
    output: {
      path: path.join(__dirname, 'fixture/dist'),
      filename: 'main.js'
    },
    plugins: [
      new HttpImport({
        reload: true,
        cacheDir: path.join(__dirname, 'fixture/cache')
      })
    ]
  })
  const stats = await util.promisify(compiler.run.bind(compiler))()
  if (stats.hasErrors()) {
    throw new Error(stats.toString('errors-only'))
  }
})
