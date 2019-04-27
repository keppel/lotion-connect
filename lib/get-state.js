let createAppHashStore = require('./app-hash-store.js')
let get = require('lodash.get')
let { RpcClient } = require('tendermint')
let verify = require('merk/verify')

function getState(lc) {
  let { getHashAtHeight } = createAppHashStore(lc)
  return async (path = '') => {
    let { response } = await lc.rpc.abciQuery()
    let proof
    try {
      proof = JSON.parse(response.value)
    } catch (e) {
      throw new Error('invalid json in query response')
    }
    let expectedRootHash = await getHashAtHeight(response.height)
    let value = verify(expectedRootHash, proof, path)
    return value
  }
}

module.exports = getState
