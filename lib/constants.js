const os = require('os')
const path = require('path')

exports.CACHE_DIR = path.join(os.homedir(), '.import-http')
