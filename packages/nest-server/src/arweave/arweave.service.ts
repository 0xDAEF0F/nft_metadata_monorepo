import { Injectable } from '@nestjs/common'
import Arweave from 'arweave'

@Injectable()
export class ArweaveService {
  arweave: Arweave

  constructor() {
    this.arweave = Arweave.init({})
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

  getArweaveAddressFromPrivateKey(
    pk: Awaited<ReturnType<typeof this.generateArweavePrivateKey>>,
  ) {
    return this.arweave.wallets.jwkToAddress(pk)
  }

  async getArBalanceFromAddress(address: string) {
    const winstonBalance = await this.arweave.wallets.getBalance(address)
    return this.arweave.ar.winstonToAr(winstonBalance)
  }
}
