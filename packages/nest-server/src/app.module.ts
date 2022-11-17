import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CryptoService } from './crypto/crypto.service'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CryptoService],
})
export class AppModule {}
