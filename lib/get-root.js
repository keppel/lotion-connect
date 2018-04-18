let { createHash } = require('crypto')
let { stringify } = require('./json.js')

module.exports = function getAppStateHash(store) {
  let hash = createHash('sha256')
    .update(stringify(store))
    .digest('hex')

  return hash
}
