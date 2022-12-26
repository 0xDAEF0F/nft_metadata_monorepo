import { Injectable } from '@nestjs/common'
import { configureChains, createClient, chain, Chain } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { ConfigService } from '@nestjs/config'
import { Network } from '@prisma/client'
import { match } from 'ts-pattern'
import { concat } from 'lodash'

@Injectable()
export class WagmiService {
  public wagmiClient = createClient({ provider: this.initializeProvider() })
  public provider: ReturnType<typeof this.initializeProvider>

  constructor(private configService: ConfigService) {
    this.provider = this.initializeProvider()
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

  getNameFromChainId(id: Chain['id']) {
    return match(id)
      .with(1, () => 'Mainnet')
      .with(137, () => 'Polygon')
      .with(42161, () => 'Arbitrum')
      .with(10, () => 'Optimism')
      .with(5, () => 'Goerli')
      .with(31337, () => 'Localhost')
      .otherwise(() => 'Unknown')
  }

  getAllSupportedChainIds() {
    const networkIds = [1, 137, 42161, 10]
    const testNetworkIds = [5, 31337]

    if (this.configService.getOrThrow('NODE_ENV') === 'development')
      return concat(networkIds, testNetworkIds)

    return networkIds
  }

  getHttpUrlForRpc(chain: Chain) {
    switch (chain.id) {
      case 1:
        return this.configService.getOrThrow<string>('ALCHEMY_RPC_URL_MAINNET')
      case 137:
        return this.configService.getOrThrow<string>('ALCHEMY_RPC_URL_POLYGON')
      case 42161:
        return this.configService.getOrThrow<string>('ALCHEMY_RPC_URL_ARBITRUM')
      case 10:
        return this.configService.getOrThrow<string>('ALCHEMY_RPC_URL_OPTIMISM')
      case 5:
        return this.configService.getOrThrow<string>('ALCHEMY_RPC_URL_GOERLI')
      case 31337:
        return this.configService.getOrThrow<string>('LOCAL_RPC_URL_LOCALHOST')
      default:
        return this.configService.getOrThrow<string>('LOCAL_RPC_URL_LOCALHOST')
    }
  }

  private initializeProvider() {
    const { provider } = configureChains(
      [
        chain.mainnet,
        chain.polygon,
        chain.arbitrum,
        chain.optimism,
        // testnets
        chain.foundry,
        chain.goerli,
      ],
      [
        jsonRpcProvider({
          rpc: (chain) => ({ http: this.getHttpUrlForRpc(chain) }),
        }),
      ],
    )
    return provider
  }
}
