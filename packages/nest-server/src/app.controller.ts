import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth/auth.service'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { CryptoService } from './crypto/crypto.service'

@Controller()
export class AppController {
  constructor(
    private cryptoService: CryptoService,
    private authService: AuthService,
  ) {}

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

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
