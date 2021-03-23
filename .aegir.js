'use strict'

const getPort = require('aegir/utils/get-port')
const PinningService = require('./test/utils/mock-pinning-service')

/** @type {import('aegir').PartialOptions} */
module.exports = {
  test: {
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
