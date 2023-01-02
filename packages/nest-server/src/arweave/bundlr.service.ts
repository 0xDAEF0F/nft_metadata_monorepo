import { Injectable } from '@nestjs/common'
import Bundlr from '@bundlr-network/client'
import { JWKInterface } from 'arweave/node/lib/wallet'

@Injectable()
export class BundlrService extends Bundlr {
  constructor() {
    super(
      'http://node1.bundlr.network',
      'arweave',
      JSON.parse(process.env.ARWEAVE_PRIVATE_KEY as string) as JWKInterface,
    )
  }
}
