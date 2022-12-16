import { Module } from '@nestjs/common'
import { WagmiController } from './wagmi.controller'
import { WagmiService } from './wagmi.service'

@Module({
  providers: [WagmiService],
  controllers: [WagmiController],
  exports: [WagmiService],
})
export class WagmiModule {}
