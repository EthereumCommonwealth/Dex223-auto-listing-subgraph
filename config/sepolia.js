/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: 'sepolia',
  v1: {
    contracts: {
      autoListingsRegistry: {
        name: 'AutoListingsRegistry',
        address: '0xDbfB961FbcDED21fdC0277D76Dd4CBb2bcd5542f'.toLowerCase(),
        startBlock: 6799214
      },
      tokenConverter: {
        name: 'TokenConverter',
        address: '0x044845FB22B4258d83a6c24b2fB061AFEba7e5b9'.toLowerCase()
      }
    }
  }
}
