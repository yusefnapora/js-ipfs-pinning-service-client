'use strict'

const {ApiClient, PinsApi} = require('../generated')

class PinningClient {
    /**
     * Construct a new PinningClient for a remote IPFS Pinning Service.
     *
     * @param {Object} opts
     * @param {String} opts.name The name of the remote pinning service
     * @param {String} opts.endpoint The remote pinning service endpoint URL
     * @param {String|Function} opts.accessToken A JWT access token for the remote pinning service, or a function that returns one
     */
    constructor(opts) {
        const {name, endpoint, accessToken} = opts

        if (!endpoint) {
            throw new Error('Required option "endpoint" missing.')
        }
        if (!accessToken) {
            throw new Error('Required option "accessToken" missing.')
        }

        const client = new ApiClient()
        client.basePath = endpoint.toString().replace(/\/$/, "") // trim trailing slashes
        client.defaultHeaders = {
            'User-Agent': 'js-ipfs-pinning-service-client/0.0.1'
        }
        client.authentications = {
            'accessToken': {
                type: 'bearer',
                accessToken: accessToken,
            }
        }

        this.name = name || 'remote pinning service'
        this.api = new PinsApi(client)
    }

    /**
     * List pin objects, returning a single page of results.
     * List all the pin objects, matching optional filters; when no filter is provided, only successful pins are returned
     * @param {Object} opts Optional parameters
     * @param {String|Array.<String>} opts.cid Return pin objects responsible for pinning the specified CID(s); be aware that using longer hash functions introduces further constraints on the number of CIDs that will fit under the limit of 2000 characters per URL  in browser contexts
     * @param {String} opts.name Return pin objects with specified name (by default a case-sensitive, exact match)
     * @param {module:model/TextMatchingStrategy} opts.match Customize the text matching strategy applied when name filter is present
     * @param {Array.<module:model/Status>} opts.status Return pin objects for pins with the specified status
     * @param {Date} opts.before Return results created (queued) before provided timestamp
     * @param {Date} opts.after Return results created (queued) after provided timestamp
     * @param {Number} opts.limit Max records to return (default to 10)
     * @param {Object.<String, {String: String}>} opts.meta Return pin objects that match specified metadata
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PinResults}
     */
    async ls(opts) {
        if (!Array.isArray(opts.cid)) {
            opts.cid = [opts.cid]
        }
        opts.cid = opts.cid.map(c => c.toString())
        return this.api.pinsGet(opts)
    }

    /**
     * List pin objects, returning an async iterator that will yield all results. This may make multiple network requests
     * depending on the size of the result set.
     *
     * List all the pin objects, matching optional filters; when no filter is provided, only successful pins are returned
     * @param {Object} opts Optional parameters
     * @param {String|Array.<String>} opts.cid Return pin objects responsible for pinning the specified CID(s); be aware that using longer hash functions introduces further constraints on the number of CIDs that will fit under the limit of 2000 characters per URL  in browser contexts
     * @param {String} opts.name Return pin objects with specified name (by default a case-sensitive, exact match)
     * @param {module:model/TextMatchingStrategy} opts.match Customize the text matching strategy applied when name filter is present
     * @param {Array.<module:model/Status>} opts.status Return pin objects for pins with the specified status
     * @param {Date} opts.before Return results created (queued) before provided timestamp
     * @param {Date} opts.after Return results created (queued) after provided timestamp
     * @param {Number} opts.limit Max records to return for each network request (default to 10)
     * @param {Object.<String, {String: String}>} opts.meta Return pin objects that match specified metadata
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PinResults}
     */
    async * list(opts) {
        if (!Array.isArray(opts.cid)) {
            opts.cid = [opts.cid]
        }
        let results = await this.ls(opts)
        const total = results.count
        let yielded = 0
        while (yielded < total) {
            if (results.results.length == 0) {
                return
            }

            for (const status of results.results) {
                yielded += 1
                yield status
            }

            // request the next page of pins (older than the oldest from this page)
            const oldestResult = results.results[results.results.length-1]
            opts.before = oldestResult.created
            results = await this.ls(opts)
        }
    }

    /**
     * Add pin object
     * Add a new pin object for the current access token
     * @param {module:model/Pin} pin
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PinStatus}
     */
    async add(pin) {
        pin.cid = pin.cid.toString()
        return this.api.pinsPost(pin)
    }

    /**
     * Remove pin object
     * Remove a pin object
     * @param {String} requestid
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
     */
    async delete(requestId) {
        return this.api.pinsRequestidDelete(requestId)
    }

    /**
     * Get pin object
     * Get a pin object and its status
     * @param {String} requestid
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PinStatus}
     */
    async get(requestId) {
        return this.api.pinsRequestidGet(requestId)
    }

    /**
     * Replace pin object
     * Replace an existing pin object (shortcut for executing remove and add operations in one step to avoid unnecessary garbage collection of blocks present in both recursive pins)
     * @param {String} requestId
     * @param {module:model/Pin} pin
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PinStatus}
     */
    async replace(requestId, pin) {
        return this.api.pinsRequestidPost(requestid, pin)
    }
}

module.exports = PinningClient
