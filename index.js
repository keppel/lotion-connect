let startLightClientFromGenesis = require('./lib/connect-by-address-from-genesis.js')
let GetState = require('./lib/get-state.js')
let SendTx = require('./lib/send-tx.js')
let getPeerGCI = require('./lib/gci-get-peer.js')
let Proxmise = require('proxmise')
let jpfs = require('jpfs')
let { parse, stringify } = require('deterministic-json')

function connect(GCI, opts = {}) {
  return new Promise(async (resolve, reject) => {
    let nodes = opts.nodes || []
    let genesis = opts.genesis

    if (!genesis) {
      let rawGenesis = await jpfs.get(GCI)
      try {
        genesis = parse(rawGenesis)
      } catch (e) {
        throw new Error('invalid GCI')
      }
    }

    let nodeAddress
    if (nodes.length) {
      // randomly sample from supplied seed nodes
      let randomIndex = Math.floor(Math.random() * nodes.length)
      nodeAddress = nodes[randomIndex]
    } else {
      // gci discovery magic...
      nodeAddress = await getPeerGCI(GCI)
    }

    let lc = await startLightClientFromGenesis(genesis, nodeAddress)
    let getState = GetState(lc)
    let sendTx = SendTx(lc)
    await delay()
    resolve({
      getState,
      send: sendTx,
      state: Proxmise(async path => {
        return await getState(path.join('.'))
      })
    })
  })
}

function delay(ms = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

module.exports = connect
