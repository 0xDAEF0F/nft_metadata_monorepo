import { Injectable } from '@nestjs/common'
import { configureChains, createClient, chain, Chain } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { ConfigService } from '@nestjs/config'
import { Network } from '@prisma/client'
import { match } from 'ts-pattern'

@Injectable()
export class WagmiService {
  constructor(private configService: ConfigService) {}

  private wagmiClient = createClient({ provider: this.getProvider() })

  getWagmiClient() {
    this.wagmiClient.getProvider()
    return this.wagmiClient
  }

  getChainIdFromName(name: Network) {
    return match(name)
      .with('MAINNET', () => 1)
      .with('POLYGON', () => 137)
      .with('ARBITRUM', () => 42161)
      .with('OPTIMISM', () => 10)
      .with('GOERLI', () => 5)
      .with('LOCALHOST', () => 31337)
      .exhaustive()
  }

  getHttpUrlForRpc(chain: Chain) {
    switch (chain.id) {
      case 1:
        return this.configService.getOrThrow('ALCHEMY_RPC_URL_MAINNET')
      case 137:
        return this.configService.getOrThrow('ALCHEMY_RPC_URL_POLYGON')
      case 42161:
        return this.configService.getOrThrow('ALCHEMY_RPC_URL_ARBITRUM')
      case 10:
        return this.configService.getOrThrow('ALCHEMY_RPC_URL_OPTIMISM')
      case 5:
        return this.configService.getOrThrow('ALCHEMY_RPC_URL_GOERLI')
      case 31337:
        return this.configService.getOrThrow('LOCAL_RPC_URL_LOCALHOST')
      default:
        throw new Error()
    }
  }

  private getProvider() {
    const { provider } = configureChains(
      [
        chain.mainnet,
        chain.polygon,
        chain.arbitrum,
        chain.optimism,
        // testnets
        chain.localhost,
        chain.goerli,
      ],
      [
        jsonRpcProvider({
          rpc: this.getHttpUrlForRpc,
        }),
      ],
    )
    return provider
  }
}
