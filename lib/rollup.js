const path = require('path')
const { parse: parseURL } = require('url')
const {
  outputFile,
  pathExists,
  readFile,
  HTTP_RE,
  resolveURL
} = require('./utils')
const createHttpCache = require('./http-cache')
const { CACHE_DIR } = require('./constants')
const fetch = require('./fetch')

const PREFIX = '\0'

const removePrefix = id => id && id.replace(/^\0/, '')

const shouldLoad = id => {
  return HTTP_RE.test(removePrefix(id))
}

module.exports = ({ reload, cacheDir = CACHE_DIR } = {}) => {
  const DEPS_DIR = path.join(cacheDir, 'deps')
  const HTTP_CACHE_FILE = path.join(cacheDir, 'requests.json')

  const getFilePathFromURL = url => {
    const { host, pathname, protocol } = parseURL(url)
    // Where should this url be in the disk
    return path.join(DEPS_DIR, protocol.replace(':', ''), host, pathname)
  }

  const httpCache = createHttpCache(HTTP_CACHE_FILE)

  return {
    name: 'http',

    async resolveId(importee, importer) {
      // We're importing from URL
      if (HTTP_RE.test(importee)) {
        return PREFIX + importee
      }

      // We're importing a file but the importer the a URL
      // Then we should do
      if (importer) {
        importer = importer.replace(/^\0/, '')
        if (HTTP_RE.test(importer)) {
          return resolveURL(importer, importee)
        }
      }
    },

    async load(id) {
      if (!shouldLoad(id)) return

      id = removePrefix(id)
      const url = await httpCache.get(id)
      let file

      if (url && !reload) {
        file = getFilePathFromURL(url)
        if (await pathExists(file)) {
          return readFile(file, 'utf8')
        }
      }

      // We have never requested this before
      const res = await fetch(id)
      file = getFilePathFromURL(res.url)
      await httpCache.set(id, res.url)
      const content = await res.buffer().then(buff => buff.toString('utf8'))
      await outputFile(file, content, 'utf8')

      return content
    }
  }
}
