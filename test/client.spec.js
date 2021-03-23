const {it, describe, afterEach } = require('mocha')
const chai = require('chai')
const { expect } = chai
const chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)

const bent = require('bent')

const PinningClient = require('../src')

const FIXTURE_CIDS = [
  'bafybeieeomufuwkwf7sbhyo7yiifaiknm7cht5tc3vakn25vbvazyasp3u',
  'bafybeifszd4wbkeekwzwitvgijrw6zkzijxutm4kdumkxnc6677drtslni',
  'bafybeihhii26gwp4w7b7w7d57nuuqeexau4pnnhrmckikaukjuei2dl3fq'
]

describe('PinningClient', async () => {
  const validConfig = {
    name: 'pinbot',
    endpoint: process.env.PINNING_SERVICE_ENDPOINT,
    accessToken: process.env.PINNING_SERVICE_KEY,
  }

  describe('constructor', () => {
    it('requires a config object to create', () => {
      expect(() => new PinningClient()).to.throw()
    })

    it('requires an endpoint option', () => {
      let config = {...validConfig, endpoint: undefined}
      expect(() => new PinningClient(config)).to.throw()
    })

    it('requires an accessToken option', () => {
      let config = {...validConfig, accessToken: undefined}
      expect(() => new PinningClient(config)).to.throw()
    })

    it('can be constructed with a valid config', () => {
      expect(() => new PinningClient(validConfig)).to.not.throw()
    })
  })

  describe('add', async () => {
    const client = new PinningClient(validConfig)
    afterEach(async () => {
      await clearAllPins()
    })

    it('requires a CID', async () => {
      expect(client.add({})).to.eventually.throw()
    })

    it('adds a pin by its CID', async () => {
      const cid = FIXTURE_CIDS[0]
      const status = await client.add({cid})
      expect(status.pin.cid).to.equal(cid)

      const { pin } = await getRawPinStatusByCid(cid)
      expect(pin.cid).to.equal(cid)
    })

    it('allows attaching a name to a pin', async() => {
      const cid = FIXTURE_CIDS[0]
      const name = 'amazing.gif'
      const status = await client.add({cid, name})
      expect(status.pin.cid).to.equal(cid)
      expect(status.pin.name).to.equal(name)
    })

    it('accepts a list of origin multiaddr strings', async () => {
      const cid = FIXTURE_CIDS[0]
      const origins = ['/ip4/127.0.0.1/tcp/42/p2p/QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM']
      const status = await client.add({cid, origins})
      expect(status.pin.cid).to.equal(cid)
      expect(status.pin.origins).to.deep.equal(origins)
    })

    it('accepts an arbitrary metadata object', async () => {
      const cid = FIXTURE_CIDS[0]
      const meta = {splines: 'reticulated'}
      const status = await client.add({cid, meta})
      expect(status.pin.cid).to.equal(cid)
      expect(status.pin.meta).to.deep.equal(meta)
    })
  })

  describe('delete', async () => {
    const client = new PinningClient(validConfig)
    beforeEach(async () => {
      for (const cid of FIXTURE_CIDS) {
        await addPinRaw({cid})
      }
    })
    afterEach(async () => {
      await clearAllPins()
    })

    it('deletes a pin by request id', async () => {
      const cid = FIXTURE_CIDS[0]
      const {requestid} = await getRawPinStatusByCid(cid)
      expect(requestid).to.not.be.empty
      await client.delete(requestid)
      
      expect(getRawPinStatusByRequestId(requestid)).to.eventually.throw()
      expect(getRawPinStatusByCid(cid)).to.eventually.be.null
    })

    it('does nothing if the requestid does not exist', async () => {
      expect(client.delete(100000)).to.eventually.not.throw()
    })
  })

  describe('get', async () => {
    const client = new PinningClient(validConfig)
    beforeEach(async () => {
      for (const cid of FIXTURE_CIDS) {
        await addPinRaw({cid})
      }
    })
    afterEach(async () => {
      await clearAllPins()
    })

    it('gets a pin by request id', async () => {
      const cid = FIXTURE_CIDS[0]
      const {requestid} = await getRawPinStatusByCid(cid)
      expect(requestid).to.not.be.empty
      const { pin } = await client.get(requestid)
      expect(pin.cid).to.equal(cid)
    })

    it('throws if the requestid does not exist', () => {
      expect(client.get(100000)).to.eventually.throw()
    })
  })

  describe('replace', async () => {
    const client = new PinningClient(validConfig)
    beforeEach(async () => {
      for (const cid of FIXTURE_CIDS) {
        await addPinRaw({cid})
      }
    })
    afterEach(async () => {
      await clearAllPins()
    })

    it('replaces an existing pin with a new one', async () => {
      const cid = FIXTURE_CIDS[0]
      const {requestid} = await getRawPinStatusByCid(cid)
      expect(requestid).to.not.be.empty

      const pin = {cid, name: 'foobar'}
      const resp = await client.replace(requestid, pin)
      expect(resp.pin.cid).to.equal(pin.cid)
      expect(resp.pin.name).to.equal('foobar')
    })

    it('throws if requestid does not exist', async () => {
      const pin = {cid: FIXTURE_CIDS[0], name: 'foobar'}
      expect(client.replace(1000000, pin)).to.eventually.throw()
    })
  })

  describe('ls', async () => {

  })
})


// we use raw HTTP requests to list and clear pins from the mock pinning service
// this way we don't have to use the system-under-test to setup the test, which could mask bugs
function httpApi() {
  const headers = {'Authorization': `Bearer ${process.env.PINNING_SERVICE_KEY}`}
  const url = `${process.env.PINNING_SERVICE_ENDPOINT}`
  const get = bent(url, headers, 'json')
  const post = bent('POST', url, headers, 'json', 202) // DELETE, POST, etc use 202 status for success
  const del = bent('DELETE', url, headers, 202)
  return {get, post, del}
}

async function clearAllPins() {
  const {get, del} = httpApi()

  // loop through all pins and collect request ids
  try {
    const ids = []
    let resp = await get('/pins?status=queued,pinning,pinned,failed')
    while (true) {
      if (!resp.results || resp.results.length === 0) {
        break
      }
      for (const res of resp.results) {
        ids.push(res.requestid)
      }
      if (ids.length >= resp.count) {
        break
      }
      resp = await get('/pins?status=queued,pinning,pinned,failed')
    }

    for (const id of ids) {
      await del(`/pins/${id}`)
    }
  } catch (e) {
    if (typeof e.text === 'function') {
      const msg = await e.text()
      console.log('error:', msg)
    } else {
      console.log('error:', e.message)
    }
  }
}

async function getRawPinStatusByCid(cid) {
  const { get } = httpApi()
  const resp = await get(`/pins?cid=${cid}&status=queued,pinning,pinned,failed`)
  if (resp.results.length < 1) {
    return null
  } 
  return resp.results[0]
}

async function getRawPinStatusByRequestId(requestid) {
  const { get } = httpApi()
  return get(`/pins/${requestid}`)
}

async function addPinRaw(pin) {
  const { post } = httpApi()
  return post('/pins', pin)
}