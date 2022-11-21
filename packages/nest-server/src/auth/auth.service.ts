import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync, hashSync } from 'bcryptjs'
import { DeveloperAccount } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { CredentialsDto } from './credentials-dto'
import { CryptoService } from 'src/crypto/crypto.service'

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
  ) {}

  async createUser(credentials: CredentialsDto) {
    const { username, password } = credentials
    const newWallet = this.cryptoService.createEthereumWallet()
    const publicAddress = newWallet.address
    const hPassword = hashSync(password)
    const ePrivateKey = await this.cryptoService.encryptEthPrivateKey(
      newWallet.privateKey,
      password,
    )
    const devAcct = await this.prismaService.developerAccount.create({
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

  async validateUser(username: string, pass: string) {
    const user = await this.prismaService.developerAccount.findUnique({
      where: { username },
    })
    if (user && compareSync(pass, user.hPassword)) {
      const { hPassword, ePrivateKey, ...result } = user
      return result
    }
    return null
  }

  async login(user: DeveloperAccount) {
    const payload = { username: user.username, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
