import { Injectable } from '@nestjs/common'
import Arweave from 'arweave'
import { JWKInterface } from 'arweave/node/lib/wallet'

@Injectable()
export class ArweaveService {
  private arweave: Arweave

  constructor() {
    this.arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
    })
  }

  generateArweavePrivateKey() {
    return this.arweave.wallets.generate()
  }

  async createArweaveCredentials() {
    const privateKey = await this.generateArweavePrivateKey()
    const address = await this.getArweaveAddressFromPrivateKey(privateKey)
    return {
      address,
      privateKey,
    }
  }

  getArweaveAddressFromPrivateKey(jwk: JWKInterface) {
    return this.arweave.wallets.jwkToAddress(jwk)
  }

  async getArBalanceFromAddress(address: string) {
    return this.arweave.wallets.getBalance(address)
  }
}
