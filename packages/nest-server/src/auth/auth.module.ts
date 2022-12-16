import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { PrismaService } from 'src/prisma.service'
import { CryptoService } from 'src/crypto/crypto.service'
import { AuthController } from './auth.controller'
import { WagmiModule } from 'src/wagmi/wagmi.module'

@Module({
  imports: [
    PassportModule,
    WagmiModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.PRODUCTION === 'true' ? '1d' : '7d',
      },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    PrismaService,
    CryptoService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
