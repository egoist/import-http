const { outputFile } = require('./utils')

module.exports = file => {
  let data = {}

  try {
    data = require(file)
  } catch (error) {}

  return {
    async set(key, value) {
      data[key] = value
      await outputFile(file, JSON.stringify(data), 'utf8')
    },

    async get(key) {
      return data[key]
    },

    async clear() {
      data = {}
      await outputFile(file, '{}', 'utf8')
    }
  }
}
