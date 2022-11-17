import { Controller, Get, Post } from '@nestjs/common'
import { CryptoService } from './crypto/crypto.service'

@Controller()
export class AppController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('new-wallet')
  newWallet() {
    const wallet = this.cryptoService.createEthereumWallet()
    const privateKey = wallet.privateKey
    const address = wallet.address
    return { privateKey, address }
  }

  @Post('create-collection')
  async createCollection() {
    try {
      const txn = await this.cryptoService.createERC1155Contract()
      return { hash: txn.hash }
    } catch (error) {
      console.log(error)
      return { error }
    }
  }
}
