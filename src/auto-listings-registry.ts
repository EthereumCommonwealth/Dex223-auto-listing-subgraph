import {
  TokenListed as TokenListedEvent,
  ListingPrice as ListingPriceEvent,
  ListingContractUpdated as ListingContractUpdatedEvent
} from './types/AutoListingsRegistry/AutoListingsRegistry'
import { TokenListed, Token, AutoListing, PriceDetail, FeeToken } from './types/schema'
import {
  fetchTokenDecimals,
  fetchTokenSymbol,
  fetchTokenName,
  fetchTokenDecimalsSlim,
  fetchTokenSymbolSlim,
  fetchTokenNameSlim,
  getTokenId,
  getTokenListedId,
  fetchNameAutoListing,
  fetchTokenInConverter
} from './utils/token'
import { ZERO_BI, ONE_BI, ADDRESS_ZERO } from './utils/constants'
import { Address, store, log, BigInt } from '@graphprotocol/graph-ts'

function getToken(addressERC20: Address, addressERC223: Address): Token | null {
  const id = getTokenId(addressERC20, addressERC223)
  let token = Token.load(id)
  if (token == null) {
    token = new Token(id)
    let decimals = fetchTokenDecimals(addressERC20, addressERC223)
    if (decimals === null) {
      return null
    }
    token.addressERC20 = addressERC20.toHexString()
    token.addressERC223 = addressERC223.toHexString()
    token.decimals = decimals
    token.inConverter = fetchTokenInConverter(addressERC20)
    token.symbol = fetchTokenSymbol(addressERC20, addressERC223)
    token.name = fetchTokenName(addressERC20, addressERC223)
    token.numberAdditions = ZERO_BI
  }
  return token as Token
}

function getFeeToekn(address: Address): FeeToken | null {
  let feeToken = FeeToken.load(address.toHexString())
  if (feeToken == null) {
    feeToken = new FeeToken(address.toHexString())
    if (address.equals(Address.fromString(ADDRESS_ZERO))) {
      feeToken.decimals = BigInt.fromI32(18)
      feeToken.address = ADDRESS_ZERO
      feeToken.symbol = 'ETH'
      feeToken.name = 'Ether'
      feeToken.inConverter = false
    } else {
      let decimals = fetchTokenDecimalsSlim(address)
      if (decimals === null) {
        return null
      }
      feeToken.decimals = decimals
      feeToken.address = address.toHexString()
      feeToken.symbol = fetchTokenSymbolSlim(address)
      feeToken.name = fetchTokenNameSlim(address)
      feeToken.inConverter = fetchTokenInConverter(address)
    }
  }
  return feeToken
}

export function handleTokenListed(event: TokenListedEvent): void {
  const addressERC20 = event.params._tokenERC20
  const addressERC223 = event.params._tokenERC223
  const listedBy = event.params._listedBy
  const timestamp = event.block.timestamp
  let token = getToken(addressERC20, addressERC223)
  if (token == null) {
    return
  }
  token.numberAdditions = token.numberAdditions.plus(ONE_BI)
  let autoListing = AutoListing.load(listedBy.toHexString())
  if (autoListing == null) {
    log.error('AutoListing not found for address {}', [listedBy.toHexString()])
    return
  }
  autoListing.totalTokens = autoListing.totalTokens.plus(ONE_BI)
  autoListing.lastUpdated = timestamp
  const listedById = getTokenListedId(addressERC20, addressERC223, listedBy)
  let tokenListed = TokenListed.load(listedById)
  if (tokenListed == null) {
    tokenListed = new TokenListed(listedById)
    tokenListed.timestamp = timestamp
    tokenListed.token = token.id
    tokenListed.authListing = autoListing.id
  }

  token.save()
  tokenListed.save()
  autoListing.save()
}

export function handleListingContractUpdated(event: ListingContractUpdatedEvent): void {
  const autoListingAddress = event.params._autolisting
  const metadata = event.params._metadata
  const owner = event.params._owner
  const url = event.params._url
  if (
    owner.equals(Address.fromString(ADDRESS_ZERO)) ||
    owner.equals(autoListingAddress) ||
    autoListingAddress.equals(Address.fromString(ADDRESS_ZERO)) 
  ) {
    log.debug('Owner address is invalid {}', [owner.toHexString()])
    return
  }
  log.debug('AutoListing address {} and owner address {}', [autoListingAddress.toHexString(), owner.toHexString()])

  let autoListing = AutoListing.load(autoListingAddress.toHexString())

  if (autoListing == null) {
    autoListing = new AutoListing(autoListingAddress.toHexString())
    autoListing.totalTokens = ZERO_BI
    autoListing.name = fetchNameAutoListing(autoListingAddress)
  }
  autoListing.lastUpdated = event.block.timestamp
  autoListing.url = url
  autoListing.meta = metadata
  autoListing.owner = owner.toHexString()
  autoListing.save()
}

export function handleListingPrice(event: ListingPriceEvent): void {
  const priceDetailId = `${event.params._autolisting.toHexString()}-${event.params._token.toHexString()}`
  const feeTokenAddress = event.params._token
  const priceValue = event.params._price

  let autoListing = AutoListing.load(event.params._autolisting.toHexString())
  if (autoListing === null) {
    log.debug('AutoListing not found for address {}', [event.params._autolisting.toHexString()])
    return
  }

  let feeToken = getFeeToekn(feeTokenAddress)
  if (feeToken === null) {
    log.debug('Token not found for address {} == ', [feeTokenAddress.toHexString()])
    return
  }
  let priceDetail = PriceDetail.load(priceDetailId)

  if (priceDetail == null) {
    priceDetail = new PriceDetail(priceDetailId)
    priceDetail.autoListing = autoListing.id
  }

  if (priceValue.equals(ZERO_BI)) {
    // Remove row PriceDetail
    store.remove('PriceDetail', priceDetailId)

    // Remove realstionship for this PriceDetail in array priceDetail schema AutoListing
    autoListing.save()

    return
  }

  feeToken.save()

  priceDetail.price = event.params._price
  priceDetail.feeTokenAddress = feeToken.id // Find schema Token id
  priceDetail.save()
  autoListing.save()
}
