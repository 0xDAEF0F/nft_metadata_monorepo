import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { scrypt } from 'scrypt-js'
import { ethers } from 'ethers'
import { artifacts } from 'foundry-tk'
import * as aesjs from 'aes-js'
import to from 'await-to-js'
import { z } from 'nestjs-zod/z'
import { PrismaService } from 'src/prisma.service'
import { WagmiService } from 'src/wagmi/wagmi.service'
import { fetchBalance } from 'wagmi/actions'
import { Network } from '@prisma/client'
@Injectable()
export class CryptoService {
  constructor(
    private prismaService: PrismaService,
    private wagmiService: WagmiService,
  ) {}

  async deriveKeyFromHumanReadablePassword(password: string) {
    const pass = Buffer.from(password)
    // TODO: Give each user some salt?
    const salt = Buffer.from('salt')
    const N = 1024,
      r = 8,
      p = 1,
      dkLen = 32
    return scrypt(pass, salt, N, r, p, dkLen)
  }

  async encryptEthPrivateKey(privateKey: string, password: string) {
    const privateKeyAsBytes = aesjs.utils.utf8.toBytes(privateKey)
    const dKey = await this.deriveKeyFromHumanReadablePassword(password)
    const aesCtr = new aesjs.ModeOfOperation.ctr(dKey)
    const encryptedBytes = aesCtr.encrypt(privateKeyAsBytes)
    const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)
    return encryptedHex
  }

  async decryptEthPrivateKey(ePrivateKey: string, password: string) {
    const ePrivateKeyAsBytes = aesjs.utils.hex.toBytes(ePrivateKey)
    const dKey = await this.deriveKeyFromHumanReadablePassword(password)
    const aesCtr = new aesjs.ModeOfOperation.ctr(dKey)
    const decryptedBytes = aesCtr.decrypt(ePrivateKeyAsBytes)
    const decryptedUtf8 = aesjs.utils.utf8.fromBytes(decryptedBytes)
    return decryptedUtf8
  }

  async createERC721Contract(
    privateKey: string,
    deploymentParameters: z.infer<typeof deploymentParametersSchema>,
  ) {
    const {
      merkleRoot,
      maxSupply,
      collectionName,
      collectionTicker,
      baseUrl,
      network,
    } = deploymentParameters

    const wagmiClient = this.wagmiService.getWagmiClient()
    const provider = wagmiClient.getProvider({
      chainId: this.wagmiService.getChainIdFromName(network),
    })

    const factory = new ethers.ContractFactory(
      new ethers.utils.Interface(artifacts.ERC721.abi),
      artifacts.ERC721.bytecode,
      new ethers.Wallet(privateKey).connect(provider),
    )
    const [err, contract] = await to(
      factory.deploy(
        merkleRoot,
        maxSupply,
        collectionName,
        collectionTicker,
        baseUrl,
      ),
    )
    if (err) {
      console.log(err)
      throw new InternalServerErrorException(err.message)
    }
    return { contractAddress: contract.address }
  }

  // NOTE: This function will only run in a development environment
  async fundUsersWallet() {
    const usersAddresses = await this.prismaService.user.findMany({
      select: { publicAddress: true },
    })

    const funderWallet = new ethers.Wallet(
      process.env.ANVIL_ADDRESS_ONE_PRIVATE_KEY as string,
    ).connect(
      this.wagmiService.getWagmiClient().getProvider({
        chainId: this.wagmiService.getChainIdFromName('LOCALHOST'),
      }),
    )

    for (let i = 0; i < usersAddresses.length; i++) {
      const balance = await fetchBalance({
        addressOrName: usersAddresses[i].publicAddress,
      })

      if (balance.value.gte(ethers.utils.parseEther('1'))) continue

      await funderWallet.sendTransaction({
        to: usersAddresses[i].publicAddress,
        value: ethers.utils.parseEther('1'),
      })
    }

    console.log('all user account funded')
  }
}

// TODO: Move this somewhere else
const deploymentParametersSchema = z.object({
  merkleRoot: z.string(),
  maxSupply: z.number(),
  collectionName: z.string(),
  collectionTicker: z.string(),
  baseUrl: z.string(),
  network: z.nativeEnum(Network),
})
