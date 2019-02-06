let tendermint = require('tendermint')

function startLightClientFromGenesis(genesis, nodeAddress) {
  return new Promise((resolve, reject) => {
    let validators = Object.assign({}, genesis.validators)
    Object.keys(validators).forEach(key => {
      validators[key].voting_power = Number(validators[key].power)
    })

    let clientState = {
      validators,
      commit: null,
      header: { height: 1, chain_id: genesis.chain_id }
    }
    let lc = tendermint(nodeAddress, clientState)
    lc.on('update', function(header) {})
    lc.on('error', function(err) {})
    resolve(lc)
  })
}

module.exports = startLightClientFromGenesis
