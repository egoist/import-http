<img src="https://user-images.githubusercontent.com/8784712/51839289-d122a380-2343-11e9-90b8-bc2756c5dee9.png" alt="logo">

---

[![NPM version](https://badgen.net/npm/v/import-http)](https://npmjs.com/package/import-http) [![NPM downloads](https://badgen.net/npm/dm/import-http)](https://npmjs.com/package/import-http) [![CircleCI](https://badgen.net/circleci/github/egoist/import-http/master)](https://circleci.com/gh/egoist/import-http/tree/master) [![donate](https://badgen.net/badge/support%20me/donate/ff69b4)](https://patreon.com/egoist) [![chat](https://badgen.net/badge/chat%20on/discord/7289DA)](https://chat.egoist.sh)

**Please consider [donating](https://www.patreon.com/egoist) to this project's author, [EGOIST](#author), to show your ❤️ and support.**

## Introduction

- Imports source code URLs! Like `<script type="module">` and [Deno](https://github.com/denoland/deno) but implemented in webpack. Embracing the future :)

  ```js
  import template from 'https://unpkg.com/lodash/template'

  console.log(template(`Hello <%= name %>`)({ name: 'EGOIST' }))
  ```

  Remote code is fetched and cached on first build, and never updated until
  you use the `reload` option. See more about [Caching](#caching).

- No more `node_modules` bloat, no dependency to install.

![image](https://unpkg.com/@egoist/media/projects/import-http/preview.svg)

## Install

```bash
yarn add import-http --dev
```

## Usage

### Webpack

In your `webpack.config.js`:

```js
const ImportHttpWebpackPlugin = require('import-http/webpack')

module.exports = {
  plugins: [new ImportHttpWebpackPlugin()]
}
```

That's it, try following code:

```js
import React from 'https://unpkg.com/react'
import Vue from 'https://unpkg.com/vue'

console.log(React, Vue)
```

Run webpack and it just works.

### Rollup

In your `rollup.config.js`:

```js
export default {
  plugins: [require('import-http/rollup')()]
}
```

## Caching

Resources will be fetched at the very first build, then the response will be cached in `~/.cache/import-http` dir. You can use the `reload` option to invalidate cache:

```js
const ImportHttpWebpackPlugin = require('import-http/webpack')

module.exports = {
  plugins: [
    new ImportHttpWebpackPlugin({
      reload: process.env.RELOAD
    })
  ]
}
```

Then run `RELOAD=true webpack` to update cache.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

**import-http** © EGOIST, Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/egoist/import-http/contributors)).

> [Website](https://egoist.sh) · GitHub [@EGOIST](https://github.com/egoist) · Twitter [@\_egoistlily](https://twitter.com/_egoistlily)
