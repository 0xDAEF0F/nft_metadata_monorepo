import { Controller, Get } from '@nestjs/common'
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
}
