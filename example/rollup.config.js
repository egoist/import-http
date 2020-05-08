const importHttp = require('../rollup')

export default {
  input: __dirname + '/index.js',
  output: {
    format: 'cjs',
    file: __dirname + '/dist/main.js'
  },
  plugins: [
    importHttp()
  ]
}
