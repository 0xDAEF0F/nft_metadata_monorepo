import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CryptoService } from './crypto/crypto.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { PrismaService } from './prisma.service'

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, CryptoService, PrismaService],
})
export class AppModule {}
