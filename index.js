let startLightClientFromGenesis = require('./lib/connect-by-address-from-genesis.js')
let GetState = require('./lib/get-state.js')
let SendTx = require('./lib/send-tx.js')
let getPeerGCI = require('./lib/gci-get-peer.js')
let Proxmise = require('proxmise')

function connect(GCI, opts = {}) {
  return new Promise(async (resolve, reject) => {
    let nodes = opts.nodes || []
    let genesis = opts.genesis

    if (!genesis) {
      throw new Error('genesis discovery by GCI not implemented yet')
    }

    let nodeAddress
    if (nodes.length) {
      // randomly sample from supplied seed nodes
      let randomIndex = Math.floor(Math.random() * nodes.length)
      nodeAddress = nodes[randomIndex]
    } else {
      // gci discovery magic...
      throw new Error('node discovery not implemented yet')
    }

    let lc = await startLightClientFromGenesis(genesis, nodeAddress)
    let getState = GetState(lc)
    let sendTx = SendTx(lc)
    resolve({
      getState,
      send: sendTx,
      state: Proxmise(async path => {
        return await getState(path.join('.'))
      })
    })
  })
}

module.exports = connect
