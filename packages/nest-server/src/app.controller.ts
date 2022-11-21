import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { AuthService } from './auth/auth.service'
import { CredentialsDto } from './auth/credentials-dto'
import { IsUserAvailablePipe } from './auth/is-user-available.pipe'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { CryptoService } from './crypto/crypto.service'

@Controller()
export class AppController {
  constructor(
    private cryptoService: CryptoService,
    private authService: AuthService,
  ) {}

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
    return this.authService.loginUser(req.user)
  }

  @Post('auth/register')
  @UsePipes(IsUserAvailablePipe)
  register(@Body() credentials: CredentialsDto) {
    return this.authService.createUser(credentials)
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/eject-pk')
  eject(@Body() credentials: CredentialsDto) {
    return this.authService.ejectUser(credentials)
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/whoami')
  getProfile(@Request() req) {
    return req.user
  }
}
