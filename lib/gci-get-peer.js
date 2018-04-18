let swarm = require('webrtc-swarm')
let signalhub = require('signalhub')
// let wrtc = require('wrtc')

function getOnePeer(GCI) {
  return new Promise((resolve, reject) => {
    let hub = signalhub(GCI, ['https://signalhub-ebkytritoc.now.sh'])
    let sw = swarm(hub, {})

    sw.on('peer', function(peer, id) {
      peer.on('data', function(data) {
        // full node writing to tell me what port to use for their tendermint rpc server
        let port = Number(data.toString())
        console.log(port)
        if (port > 100 && port < 65536) {
          let rpcUrl = 'ws://' + peer.remoteAddress + ':' + port
          peer.destroy()
          resolve(rpcUrl)
        }
      })
    })
  })
}

module.exports = getOnePeer
