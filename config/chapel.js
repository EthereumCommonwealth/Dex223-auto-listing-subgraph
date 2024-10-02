/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: 'chapel',
  v1: {
    contracts: {
      autoListingsRegistry: {
        name: 'AutoListingsRegistry',
        address: '0x8D7bA93b86927b5795Ed4368c2Fb557F769FcCBd'.toLowerCase(),
        startBlock: 44379512
      },
      tokenConverter: {
        name: 'TokenConverter',
        address: '0x18EEdef5d3D21C2828Ca8557BeF7210Bfa481bC2'.toLowerCase()
      }
    }
  }
}
