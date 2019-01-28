const os = require('os')
const path = require('path')
const { parse: parseURL, resolve: resolveURL } = require('url')
const fetch = require('node-fetch')
const builtinModules = require('builtin-modules')
const { pathExists, outputFile } = require('./utils')
const createHttpCache = require('./http-cache')

const RESOLVER_ID = 'import-http-resolver'

const HTTP_RE = /^https?:\/\//

class ImportHttpPlugin {
  constructor(options = {}) {
    this.reload = options.reload
    this.cacheDir = options.cacheDir
      ? path.resolve(options.cacheDir)
      : path.join(os.homedir(), '.import-http')
    this.depsDir = path.join(this.cacheDir, 'deps')
    this.httpCache = createHttpCache(path.join(this.cacheDir, 'requests.json'))
    // Map<file, moduleId>
    this.fileModuleCache = new Map()
  }

  getFilePathFromURL(url) {
    const { host, pathname, protocol } = parseURL(url)
    // Where should this url be in the disk
    return path.join(this.depsDir, protocol.replace(':', ''), host, pathname)
  }

  apply(compiler) {
    compiler.resolverFactory.hooks.resolver
      .for('normal')
      .tap(RESOLVER_ID, resolver => {
        const resolvedHook = resolver.ensureHook(`resolve`)

        resolver
          .getHook(`described-resolve`)
          .tapAsync(
            RESOLVER_ID,
            async (requestContext, resolveContext, callback) => {
              let id = requestContext.request
              const { issuer } = requestContext.context

              // if the issuer is a URL (cached in deps dir)
              // resolve the url
              if (
                !HTTP_RE.test(id) &&
                issuer &&
                this.fileModuleCache.has(issuer) &&
                !this.fileModuleCache.has(id)
              ) {
                if (/^\./.test(id)) {
                  // Relative file
                  // Excluded something like ./node_modules/webpack/buildin/global.js
                  if (!/node_modules/.test(id)) {
                    id = resolveURL(this.fileModuleCache.get(issuer), id)
                  }
                } else if (!builtinModules.includes(id)) {
                  // Propably an npm package
                  id = `https://unpkg.com/${id}`
                }
              }

              if (!HTTP_RE.test(id)) {
                return callback()
              }

              const canResolve = (request, url) => {
                this.fileModuleCache.set(request, url)
                resolver.doResolve(
                  resolvedHook,
                  Object.assign({}, requestContext, {
                    request
                  }),
                  null,
                  resolveContext,
                  callback
                )
              }

              try {
                // Let's get the actual URL
                const url = await this.httpCache.get(id)
                let file

                if (url && !this.reload) {
                  file = this.getFilePathFromURL(url)
                  if (await pathExists(file)) {
                    return canResolve(file, url)
                  }
                }

                // We have never requested this before
                console.log(`Downloading ${id}...`)
                const res = await fetch(id)
                if (!res.ok) {
                  console.error(`Failed to download ${id}...`)
                  throw new Error(res.statusText)
                }
                file = this.getFilePathFromURL(res.url)
                await this.httpCache.set(id, res.url)
                const content = await res
                  .buffer()
                  .then(buff => buff.toString('utf8'))
                await outputFile(file, content, 'utf8')
                canResolve(file, res.url)
              } catch (error) {
                callback(error)
              }
            }
          )
      })
  }
}

module.exports = ImportHttpPlugin
