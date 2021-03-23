// const {it, describe, afterEach } = require('mocha')
const chai = require('chai')
const { expect } = chai
const chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)

const CID = require('cids')
const multihashing = require('multihashing-async')
const bent = require('bent')

const PinningClient = require('../src')

const FIXTURE_CIDS = [
  'bafybeieeomufuwkwf7sbhyo7yiifaiknm7cht5tc3vakn25vbvazyasp3u',
  'bafybeifszd4wbkeekwzwitvgijrw6zkzijxutm4kdumkxnc6677drtslni',
  'bafybeihhii26gwp4w7b7w7d57nuuqeexau4pnnhrmckikaukjuei2dl3fq',
  'QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM',
  'QmXFgNWRg3vyoMn887DFRCPK8G5atgqzHy7PyjWDmYMCnG',
]

describe('PinningClient', () => {
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

  describe('add', () => {
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

  describe('delete', () => {
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

  describe('get', () => {
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

    it('throws if the requestid does not exist', async () => {
      expect(client.get(100000)).to.eventually.throw()
    })
  })

  describe('replace', () => {
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

  describe('ls', () => {
    const client = new PinningClient(validConfig)
    // the mock pinning service will set the status based on the name
    const fixturePins = {
      'pinned-one': FIXTURE_CIDS[0],
      'pinned-two': FIXTURE_CIDS[1],
      'pinning-three': FIXTURE_CIDS[2],
      'queued-four': FIXTURE_CIDS[3],
      'failed-five': FIXTURE_CIDS[4],
    }
    beforeEach(async () => {
      for (const [name, cid] of Object.entries(fixturePins)) {
        await addPinRaw({cid, name})
      }
    })
    afterEach(async () => {
      await clearAllPins()
    })

    it('lists pins with status === "pinned" by default', async () => {
      const resp = await client.ls()
      expect(resp.count).to.equal(2)
      const cids = resp.results.map(r => r.pin.cid)
      expect(cids).to.contain(fixturePins['pinned-one'])
      expect(cids).to.contain(fixturePins['pinned-two'])
    })

    it('lists pins with any matching status', async () => {
      const resp = await client.ls({status: ['queued', 'pinning']})
      expect(resp.count).to.equal(2)
      const cids = resp.results.map(r => r.pin.cid)
      expect(cids).to.contain(fixturePins['pinning-three'])
      expect(cids).to.contain(fixturePins['queued-four'])
    })

    it('lists pins with matching CID', async () => {
      const cid = fixturePins['queued-four']
      const resp = await client.ls({cid, status: ['queued', 'pinning']})
      expect(resp.count).to.equal(1)
      expect(resp.results[0].pin.cid).to.equal(cid)
    })

    it('lists pins with matching name', async () => {
      const resp = await client.ls({name: 'pinned-one'})
      expect(resp.count).to.equal(1)
      expect(resp.results[0].pin.name).to.equal('pinned-one')
      expect(resp.results[0].pin.cid).to.equal(fixturePins['pinned-one'])
    })

    // TODO: remove .skip once this is merged: https://github.com/ipfs-shipyard/js-mock-ipfs-pinning-service/pull/4
    it.skip('lists pins created before a given Date', async () => {
      const info = await client.ls({status: ['pinned', 'queued', 'pinning', 'failed']})
      const timestamps = info.results.map(r => new Date(r.created)).sort((a, b) => a - b)

      const before = timestamps[3]
      const resp = await client.ls({before, status: ['pinned', 'queued', 'pinning', 'failed']})
      expect(resp.count).to.equal(3)
    })

    it.skip('lists pins created after a given Date', async () => {
      const info = await client.ls({status: ['pinned', 'queued', 'pinning', 'failed']})
      const timestamps = info.results.map(r => new Date(r.created)).sort((a, b) => a - b)

      const after = timestamps[2]
      const expected = timestamps.length - 3
      const resp = await client.ls({after, status: ['pinned', 'queued', 'pinning', 'failed']})
      expect(resp.count).to.equal(expected)
    })

    it('limits the number of pins returned', async () => {
      const resp = await client.ls({limit: 2, status: ['pinned', 'queued', 'pinning', 'failed']})
      expect(resp.count).to.equal(2)
    })

    it('lists pins matching metadata', async () => {
      const cid = 'QmaL3haFDRQoGW3YShV6u52eDH8RVPGQgGZrxza1p353pA'
      const meta = {foo: 'bar'}
      await addPinRaw({cid, meta})
      const resp = await client.ls({meta, status: ['pinned', 'queued', 'pinning', 'failed']})
      expect(resp.count).to.equal(1)
      expect(resp.results[0].pin.meta).to.deep.equal(meta)
    })
  })

  describe('list', () => {
    const client = new PinningClient(validConfig)
    const numPins = 100

    beforeEach(async () => {
      for (let i = 0; i < numPins; i++) {
        const cid = await testCid(i)
        const name = `pinned-${i}`
        await addPinRaw({cid, name})
      }
    })
    afterEach(async () => {
      await clearAllPins()
    })

    it('returns all results as an async iterator', async () => {
      let count = 0
      for await (const pin of client.list()) {
        count += 1
      }
      expect(count).to.equal(numPins)
    })
  })
})


async function testCid(index) {
  const content = new TextEncoder().encode(`test-content-${index}`)
  const hash = await multihashing(content, 'sha2-256')
  const cid = new CID(1, 'dag-pb', hash)
  return cid.toString()
}

// we use raw HTTP requests to list and clear pins from the mock pinning service
// this way we don't have to use the system-under-test to setup the test, which could mask bugs
function httpApi() {
  const headers = {'Authorization': `Bearer ${process.env.PINNING_SERVICE_KEY}`}
  const url = process.env.PINNING_SERVICE_ENDPOINT
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