import { Injectable } from '@nestjs/common'
import { configureChains, createClient, chain } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

@Injectable()
export class WagmiService {
  private wagmiClient = createClient({ provider: this.getProvider() })

  getWagmiClient() {
    this.wagmiClient.getProvider()
    return this.wagmiClient
  }

  private getProvider() {
    const { provider } = configureChains(
      [chain.localhost, chain.mainnet],
      [
        jsonRpcProvider({
          rpc: (chain) => ({
            http: chain.name === 'Localhost' ? 'http://127.0.0.1:8545' : '',
          }),
        }),
        publicProvider(),
      ],
    )
    return provider
  }
}
