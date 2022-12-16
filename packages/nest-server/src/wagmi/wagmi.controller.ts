import { All, Controller } from '@nestjs/common'
import { WagmiService } from './wagmi.service'
import { fetchBalance } from 'wagmi/actions'

@Controller('wagmi')
export class WagmiController {
  constructor(private wagmiService: WagmiService) {}

  @All()
  async hi() {
    const balance = await fetchBalance({
      addressOrName: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      chainId: 31337,
    })
    return { balance }
  }
}
