const envPaths = require('env-paths')

exports.CACHE_DIR = envPaths('import-http', { suffix: '' }).cache
