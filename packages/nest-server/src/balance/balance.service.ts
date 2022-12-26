import { Injectable } from '@nestjs/common'
import { WagmiService } from 'src/wagmi/wagmi.service'
import { zipObject } from 'lodash'
import { fetchBalance } from 'wagmi/actions'

@Injectable()
export class BalanceService {
  constructor(private wagmiService: WagmiService) {}

  async getNativeBalances(address: string) {
    const supportedChainIds = this.wagmiService.getAllSupportedChainIds()
    const namesOfSupportedChains = supportedChainIds.map(
      this.wagmiService.getNameFromChainId,
    )
    const balances = await Promise.all(
      supportedChainIds.map((id) =>
        fetchBalance({ addressOrName: address, chainId: id }),
      ),
    )
    return zipObject(namesOfSupportedChains, balances)
  }

  getBalanceFromChainId(chainId: number, address: string) {
    return this.wagmiService.provider({ chainId }).getBalance(address)
  }
}
