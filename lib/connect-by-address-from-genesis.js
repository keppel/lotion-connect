let tendermint = require('tendermint')

function startLightClientFromGenesis(genesis, nodeAddress) {
  return new Promise((resolve, reject) => {
    let clientState = {
      validators: genesis.validators,
      commit: null,
      header: { height: 1, chain_id: genesis.chain_id }
    }

    let lc = tendermint(nodeAddress, clientState)
    resolve(lc)
  })
}

module.exports = startLightClientFromGenesis
