'use strict'

const path = require('path')
const getPort = require('aegir/utils/get-port')
const PinningService = require('./test/utils/mock-pinning-service')

const esbuild = {
  inject: [path.join(__dirname, 'scripts/node-globals.js')],
  plugins: [
    {
      name: 'node built ins',
      setup (build) {
        build.onResolve({ filter: /^stream$/ }, () => {
          return { path: require.resolve('readable-stream') }
        })
      }
    }
  ]
}

/** @type {import('aegir').PartialOptions} */
module.exports = {
  test: {
    files: ['test/**/*.spec.js'],
    browser: {
      config: {
        buildConfig: esbuild
      }
    },
    before: async (options) => {
      const pinningService = await PinningService.start()

      return {
        env: {
          PINNING_SERVICE_ENDPOINT: pinningService.endpoint,
          PINNING_SERVICE_KEY: pinningService.token,
        },
        pinningService
      }
    },
    after: async (options, beforeResult) => {
      await PinningService.stop(beforeResult.pinningService)
    }
  },
  build: {
    config: esbuild
  },
  dependencyCheck: {
    ignore: [
      'assert',
      'cross-env',
      'rimraf',
      'url',
      'wrtc',
      'electron-webrtc',
      'ipfs-interop'
    ]
  }
}
