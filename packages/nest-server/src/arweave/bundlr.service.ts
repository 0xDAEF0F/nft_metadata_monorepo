import Bundlr from '@bundlr-network/client'
import { JWKInterface } from 'arweave/node/lib/wallet'

export class BundlrService extends Bundlr {
  constructor(jwk?: JWKInterface) {
    super('http://node1.bundlr.network', 'arweave', jwk)
  }
}
