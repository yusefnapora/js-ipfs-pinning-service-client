'use strict'

const { ApiClient, PinsApi } = require('../generated')

class PinningClient {
  /**
   * Construct a new PinningClient for a remote IPFS Pinning Service.
   *
   * @param {Object} opts
   * @param {string} opts.name - The name of the remote pinning service
   * @param {string} opts.endpoint - The remote pinning service endpoint URL
   * @param {string | Function} opts.accessToken - A JWT access token for the remote pinning service, or a function that returns one
   */
  constructor (opts) {
    const { name, endpoint, accessToken } = opts

    if (!endpoint) {
      throw new Error('Required option "endpoint" missing.')
    }
    if (!accessToken) {
      throw new Error('Required option "accessToken" missing.')
    }

    const client = new ApiClient()
    client.cache = false
    client.basePath = endpoint.toString().replace(/\/$/, '') // trim trailing slashes
    client.defaultHeaders = {
      // 'User-Agent': 'js-ipfs-pinning-service-client/0.0.1'
    }
    client.authentications = {
      accessToken: {
        type: 'bearer',
        accessToken: accessToken
      }
    }

    this.name = name || 'remote pinning service'
    this.api = new PinsApi(client)
  }

  /**
   * List pin objects, returning a single page of results.
   * List all the pin objects, matching optional filters; when no filter is provided, only successful pins are returned
   *
   * @param {Object} opts - Optional parameters
   * @param {string | Array.<string>} opts.cid - Return pin objects responsible for pinning the specified CID(s); be aware that using longer hash functions introduces further constraints on the number of CIDs that will fit under the limit of 2000 characters per URL  in browser contexts
   * @param {string} opts.name - Return pin objects with specified name (by default a case-sensitive, exact match)
   * @param {module:model/TextMatchingStrategy} opts.match - Customize the text matching strategy applied when name filter is present
   * @param {Array.<module:model/Status>} opts.status - Return pin objects for pins with the specified status
   * @param {Date} opts.before - Return results created (queued) before provided timestamp
   * @param {Date} opts.after - Return results created (queued) after provided timestamp
   * @param {number} opts.limit - Max records to return (default to 10)
   * @param {Object.<string, {String: string}>} opts.meta - Return pin objects that match specified metadata
   * @returns {Promise} - a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PinResults}
   */
  async ls (opts) {
    opts = opts || {}
    if (opts.cid) {
      if (!Array.isArray(opts.cid)) {
        opts.cid = [opts.cid]
          .filter(c => Boolean(c))
          .map(c => c.toString())
      }
      if (opts.cid.length === 0) {
        delete opts.cid
      }
    }
    if (!opts.status || opts.status.length < 1) {
      opts.status = ['pinned']
    }
    return this.api.pinsGet(opts)
  }

  /**
   * List pin objects, returning an async iterator that will yield all results. This may make multiple network requests
   * depending on the size of the result set.
   *
   * List all the pin objects, matching optional filters; when no filter is provided, only successful pins are returned
   *
   * @param {Object} opts - Optional parameters
   * @param {string | Array.<string>} opts.cid - Return pin objects responsible for pinning the specified CID(s); be aware that using longer hash functions introduces further constraints on the number of CIDs that will fit under the limit of 2000 characters per URL  in browser contexts
   * @param {string} opts.name - Return pin objects with specified name (by default a case-sensitive, exact match)
   * @param {module:model/TextMatchingStrategy} opts.match - Customize the text matching strategy applied when name filter is present
   * @param {Array.<module:model/Status>} opts.status - Return pin objects for pins with the specified status
   * @param {Date} opts.before - Return results created (queued) before provided timestamp
   * @param {Date} opts.after - Return results created (queued) after provided timestamp
   * @param {number} opts.limit - Max records to return for each network request (default to 10)
   * @param {Object.<string, {String: string}>} opts.meta - Return pin objects that match specified metadata
   * @returns {Promise} - a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PinResults}
   */
  async * list (opts) {
    opts = opts || {}
    let results = await this.ls(opts)
    const total = results.count
    let yielded = 0
    while (yielded < total) {
      if (results.results.length === 0) {
        return
      }

      for (const status of results.results) {
        yielded += 1
        yield status
      }

      // request the next page of pins (older than the oldest from this page)
      const oldestResult = results.results[results.results.length - 1]
      opts.before = oldestResult.created
      results = await this.ls(opts)
    }
  }

  /**
   * Add pin object
   * Add a new pin object for the current access token
   *
   * @param {module:model/Pin} pin
   * @returns {Promise} - a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PinStatus}
   */
  async add (pin) {
    if (!pin.cid) {
      throw new Error('unable to add pin without CID')
    }
    pin.cid = pin.cid.toString()
    const resp = await this.api.pinsPost(pin)
    return resp
  }

  /**
   * Remove pin object
   * Remove a pin object
   *
   * @param {string} requestid - the requestid from a previously pinned object
   * @returns {Promise} - a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
   */
  async delete (requestid) {
    // For Reasons Unknown, when the generated client gets a 404 from a DELETE request in the browser,
    // it throws an Error that's not contained in a promise and thus doesn't get caught if you wrap the
    // delete request in a try/catch.
    // To work around this, we first do a get request and return immediately if the get request returns a 404.
    // Things seem to work as expected on Node, so we check for the window var first to only run the extra
    // request in the browser.
    if (typeof window !== 'undefined') {
      try {
        const existing = await this.get(requestid)
      } catch (e) {
        if (e.status === 404) {
          return
        }
        throw e
      }
    }
    return this.api.pinsRequestidDelete(requestid)
  }

  /**
   * Get pin object
   * Get a pin object and its status
   *
   * @param {string} requestid - the requestid from a previously pinned object
   * @returns {Promise} - a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PinStatus}
   */
  async get (requestid) {
    return this.api.pinsRequestidGet(requestid)
  }

  /**
   * Replace pin object
   * Replace an existing pin object (shortcut for executing remove and add operations in one step to avoid unnecessary garbage collection of blocks present in both recursive pins)
   *
   * @param {string} requestid - the requestid from a previously pinned object
   * @param {module:model/Pin} pin
   * @returns {Promise} - a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PinStatus}
   */
  async replace (requestid, pin) {
    return this.api.pinsRequestidPost(requestid, pin)
  }
}

module.exports = PinningClient
