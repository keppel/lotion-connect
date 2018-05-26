let { connect } = require('peer-channel')

function getOnePeer(GCI) {
  return new Promise((resolve, reject) => {
    connect('fullnode:' + GCI).on('connect', function(conn) {
      conn.on('data', function(data) {
        // full node writing to tell me what port to use for their tendermint rpc server
        let port = Number(data.toString())
        if (port > 100 && port < 65536) {
          let rpcUrl = 'ws://' + conn.remoteAddress + ':' + port
          conn.destroy()
          resolve(rpcUrl)
        }
      })
    })
  })
}

module.exports = getOnePeer
