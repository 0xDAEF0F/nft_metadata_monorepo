import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CryptoService } from './crypto/crypto.service'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma.service'
import { APP_PIPE } from '@nestjs/core'
import { ZodValidationPipe } from 'nestjs-zod'

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    CryptoService,
    PrismaService,
    { provide: APP_PIPE, useClass: ZodValidationPipe },
  ],
})
export class AppModule {}
