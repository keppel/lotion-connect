let { encode } = require('./tx-encoding.js')
let axios = require('axios')

function SendTx(lc) {
  return async function(tx) {
    let nonce = Math.floor(Math.random() * (2 << 12))
    let txBytes = '0x' + encode(tx, nonce).toString('hex')

    return axios
      .get(parseHttpUri(lc.rpc.uri) + '/broadcast_tx_commit', {
        params: { tx: txBytes }
      })
      .then(res => res.data.result)
  }
}

function parseHttpUri(wsUri) {
  return wsUri.replace('ws', 'http').split('/websocket')[0]
}

module.exports = SendTx
