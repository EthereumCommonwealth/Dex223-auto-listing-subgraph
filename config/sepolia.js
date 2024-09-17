/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: 'sepolia',
  v1: {
    contracts: {
      autoListingsRegistry: {
        name: 'AutoListingsRegistry',
        address: '0x3941Ff18fF902B88b16cA8029c0D133Ef262a196'.toLowerCase(),
        startBlock: 6340494
      },
      tokenConverter: {
        name: 'TokenConverter',
        address: '0xe831FDB60Dc18c264f1B45cadAFD5f2f2993EE83'.toLowerCase(),
        startBlock: 6093368
      }
    }
  }
}
