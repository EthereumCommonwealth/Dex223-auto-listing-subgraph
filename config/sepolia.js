/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: 'sepolia',
  v1: {
    contracts: {
      autoListingsRegistry: {
        name: 'AutoListingsRegistry',
        // The registry every current Sepolia autolisting registers with (0x8a18…, 0xBC5f…, and the
        // 0xeA0A-factory pair 0xcF08…, 0x5BDd…). 0xDbfB… only holds two retired listings.
        address: '0x6ee7518400c14e8046252E3cC1670FC8093e618F'.toLowerCase(),
        startBlock: 9329208
      },
      tokenConverter: {
        name: 'TokenConverter',
        // The converter the UI and the Sepolia factory use.
        address: '0x5847f5C0E09182d9e75fE8B1617786F62fee0D9F'.toLowerCase()
      }
    }
  }
}
