import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { jwtConstants } from './constants'
import { JwtStrategy } from './jwt.strategy'
import { PrismaService } from 'src/prisma.service'
import { CryptoService } from 'src/crypto/crypto.service'

@Module({
  imports: [
    PassportModule,
    // TODO: expiration depends on environment
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
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
})
export class AuthModule {}
