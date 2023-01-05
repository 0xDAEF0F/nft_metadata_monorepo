import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { BalanceService } from './balance.service'
import { EthereumAddressExistsPipe } from './ethereum-address-exists.pipe'

@Controller('balance')
// @UseGuards(JwtAuthGuard)
export class BalanceController {
  constructor(private balanceService: BalanceService) {}

  @Get(':address')
  fetchNativeBalances(
    @Param('address', EthereumAddressExistsPipe) address: string,
  ) {
    return this.balanceService.getNativeBalances(address)
  }
}
