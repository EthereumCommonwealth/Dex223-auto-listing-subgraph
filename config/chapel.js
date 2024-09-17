/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: 'chapel',
  v1: {
    contracts: {
      autoListingsRegistry: {
        name: 'AutoListingsRegistry',
        address: '0x6086951d25ff6d5d56692faf19559475563afc83'.toLowerCase(),
        startBlock: 43140354
      },
      tokenConverter: {
        name: 'TokenConverter',
        address: '0xDd90b13bcb92950CA9b6b3e0407d439533eA0df2'.toLowerCase(),
        startBlock: 41355710
      }
    }
  }
}
