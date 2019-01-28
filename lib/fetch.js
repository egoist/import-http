const fetch = require('node-fetch')

module.exports = async (url, opts) => {
  console.log(`Downloading ${url}...`)
  const res = await fetch(url, opts)
  if (!res.ok) {
    console.error(`Failed to download ${url}...`)
    throw new Error(res.statusText)
  }
  return res
}
