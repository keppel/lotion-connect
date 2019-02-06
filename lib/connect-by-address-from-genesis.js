let tendermint = require('tendermint')

function startLightClientFromGenesis(genesis, nodeAddress) {
  return new Promise((resolve, reject) => {
    let validators = Object.assign({}, genesis.validators)
    validators.forEach(validator => {
      validator.voting_power = Number(validator.power)
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
