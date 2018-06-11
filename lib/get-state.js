let createAppHashStore = require('./app-hash-store.js')
let { parse } = require('./json.js')
let getRoot = require('./get-root.js')
let get = require('lodash.get')

function getState(lc) {
  let { getHashAtHeight } = createAppHashStore(lc)
  return async (path = '') => {
    let { response } = await lc.rpc.abciQuery()
    let state
    try {
      let valueString = Buffer.from(response.value, 'base64').toString()
      state = parse(valueString)
    } catch (e) {
      throw new Error('invalid json in query response')
    }
    lc.on('error', function(err) {})
    let expectedHash = await getHashAtHeight(response.height)
    let rootHash = await getRoot(state)
    if (rootHash !== expectedHash) {
      throw new Error(
        `app hash mismatch. expected: ${expectedRootHash} actual: ${rootHash}`
      )
    }

    return path ? get(state, path) : state
  }
}

module.exports = getState
