let createAppHashStore = require('./app-hash-store.js')
let { parse } = require('deterministic-json')
let getRoot = require('./get-root.js')
let get = require('lodash.get')
let { RpcClient } = require('tendermint')

function getState(lc) {
  let { getHashAtHeight } = createAppHashStore(lc)
  return async (path = '') => {
    // TODO: don't reinitialize rpc client for future versions of tendermint
    let { response } = await RpcClient(
      lc.rpc.uri.split('/websocket')[0]
    ).abciQuery()
    let state
    try {
      let valueString = Buffer.from(response.value, 'base64').toString()
      state = parse(valueString)
    } catch (e) {
      throw new Error('invalid json in query response')
    }
    let expectedHash = await getHashAtHeight(response.height)
    let rootHash = await getRoot(state)
    if (rootHash !== expectedHash) {
      throw new Error(
        `app hash mismatch. expected: ${expectedHash} actual: ${rootHash}`
      )
    }

    return path ? get(state, path) : state
  }
}

module.exports = getState
