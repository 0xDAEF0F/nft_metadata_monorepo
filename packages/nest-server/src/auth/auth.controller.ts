import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CredentialsDto } from './credentials-dto'
import { IsUserAvailablePipe } from './is-user-available.pipe'
import { JwtAuthGuard } from './jwt-auth.guard'
import { LocalAuthGuard } from './local-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    return this.authService.loginUser(req.user)
  }

  @Post('register')
  @UsePipes(IsUserAvailablePipe)
  register(@Body() credentials: CredentialsDto) {
    return this.authService.createUser(credentials)
  }

  @UseGuards(LocalAuthGuard)
  @Post('eject-pk')
  @HttpCode(200)
  eject(@Body() credentials: CredentialsDto) {
    return this.authService.ejectUser(credentials)
  }

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  getProfile(@Request() req) {
    return req.user
  }
}
