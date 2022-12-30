import { Module } from '@nestjs/common'
import { ArweaveService } from './arweave.service'
import { ArweaveController } from './arweave.controller'
import { AuthService } from 'src/auth/auth.service'
import { PrismaService } from 'src/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { CryptoService } from 'src/crypto/crypto.service'
import { WagmiService } from 'src/wagmi/wagmi.service'
import { S3Service } from 'src/s3/s3.service'
import { ConfigService } from '@nestjs/config'
import { BundlrService } from './bundlr.service'

@Module({
  providers: [
    ArweaveService,
    S3Service,
    ConfigService,
    AuthService,
    PrismaService,
    JwtService,
    CryptoService,
    WagmiService,
    BundlrService,
  ],
  exports: [ArweaveService],
  controllers: [ArweaveController],
})
export class ArweaveModule {}
