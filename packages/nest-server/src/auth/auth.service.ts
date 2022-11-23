import { Injectable, NotAcceptableException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync, hashSync } from 'bcryptjs'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { CredentialsDto } from './credentials-dto'
import { CryptoService } from 'src/crypto/crypto.service'
import { ethers } from 'ethers'

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
  ) {}

  async createUser(credentials: CredentialsDto) {
    const { username, password } = credentials
    const newWallet = ethers.Wallet.createRandom()
    const publicAddress = newWallet.address
    const hPassword = hashSync(password)
    const ePrivateKey = await this.cryptoService.encryptEthPrivateKey(
      newWallet.privateKey,
      password,
    )
    const devAcct = await this.prismaService.user.create({
      data: {
        ePrivateKey,
        hPassword,
        publicAddress,
        username,
      },
      select: { id: true, username: true, publicAddress: true },
    })
    return devAcct
  }

  async ejectUser(credentials: CredentialsDto) {
    const user = await this.prismaService.user.findUnique({
      where: { username: credentials.username },
      select: { ePrivateKey: true, publicAddress: true },
    })

    // since user already passed the local-auth guard
    // he MUST exist
    if (!user) throw new NotAcceptableException()

    const privateKey = await this.cryptoService.decryptEthPrivateKey(
      user.ePrivateKey,
      credentials.password,
    )
    return { privateKey, publicAddress: user.publicAddress }
  }

  async validateUser(username: string, pass: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    })
    if (user && compareSync(pass, user.hPassword)) {
      const { hPassword, ePrivateKey, ...result } = user
      return result
    }
    return null
  }

  async loginUser(user: User) {
    const payload = { username: user.username, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
