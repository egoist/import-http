const path = require('path')
const util = require('util')
const fs = require('fs')
const url = require('url')
const builtinModules = require('builtin-modules')

const mkdir = util.promisify(require('mkdirp'))

const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

exports.outputFile = (filepath, data, encoding) =>
  mkdir(path.dirname(filepath)).then(() => writeFile(filepath, data, encoding))

exports.readFile = readFile

exports.pathExists = fp =>
  new Promise(resolve => {
    fs.access(fp, err => {
      resolve(!err)
    })
  })

exports.HTTP_RE = /^https?:\/\//

exports.resolveURL = (issuer, id) => {
  if (/^\./.test(id)) {
    // Relative file
    // Excluded something like ./node_modules/webpack/buildin/global.js
    if (!/node_modules/.test(id)) {
      id = url.resolve(issuer, id)
    }
  } else if (!builtinModules.includes(id)) {
    // Propably an npm package
    id = `https://unpkg.com/${id}`
  }
  return id
}
