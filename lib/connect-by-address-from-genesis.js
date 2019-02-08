let tendermint = require('tendermint')

function startLightClientFromGenesis(genesis, nodeAddress) {
  return new Promise((resolve, reject) => {
    let validators = genesis.validators.map(validator => {
      return Object.assign({}, validator, {
        voting_power: Number(validator.power)
      })
    })

    let clientState = {
      validators,
      commit: null,
      header: { height: 1, chain_id: genesis.chain_id }
    }
    let lc = tendermint(nodeAddress, clientState)
    resolve(lc)
  })
}

module.exports = startLightClientFromGenesis
