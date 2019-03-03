let DC = require('discovery-channel')
let debug = require('debug')('lotion-connect:discovery')
let connectWithGCI = require('./connect-by-address-from-gci.js')

function discover (GCI) {
  return new Promise((resolve, reject) => {
    let channel = DC()
    channel.on('error', reject)
    channel.on('peer', onPeer)
    channel.join(GCI)

    function done (peer) {
      channel.destroy()
      resolve(peer)
    }

    async function onPeer (id, peer, type) {
      try {
        // connectWithGCI will ensure peer serves the correct
        // genesis, and will use that to intialize the light client.
        // if this is a bad peer, we'll keep waiting to discover
        // a good one.
        let address = `ws://${peer.host}:${peer.port}`
        debug(`attempting to connect to "${address}"`)
        let client = await connectWithGCI(address)
        debug('peer is valid')
        done(client)

      } catch (err) {
        // swallow errors since they can be trivially casued
        // by bad peers, and we'll try again later when we
        // hear about a new potential peer
        debug('error connecting to new potential peer', err.stack)
      }
    }
  })
}

module.exports = discover
