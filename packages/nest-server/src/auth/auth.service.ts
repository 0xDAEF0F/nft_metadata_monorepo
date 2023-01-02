import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
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

  getUser(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        publicAddress: true,
      },
    })
  }

  async createUser(credentials: CredentialsDto) {
    const { username, password } = credentials
    // Ethereum
    const ethersWallet = ethers.Wallet.createRandom()
    // User Info
    const hPassword = hashSync(password)
    const salt = genSaltSync()
    const ePrivateKey = await this.cryptoService.encryptEthPrivateKey(
      ethersWallet.privateKey,
      password,
      salt,
    )
    // Db transaction
    const user = await this.prismaService.user.create({
      data: {
        ePrivateKey,
        hPassword,
        publicAddress: ethersWallet.address,
        username,
        salt,
      },
      select: { id: true, username: true },
    })

    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    }
  }

  async ejectUser({ username, password }: CredentialsDto) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { username: username },
    })

    const privateKey = await this.cryptoService.decryptEthPrivateKey(
      user.ePrivateKey,
      password,
      user.salt,
    )

    return {
      privateKey,
      publicAddress: user.publicAddress,
    }
  }

  async validateCredentials(username: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    })
    if (user && compareSync(password, user.hPassword)) {
      const { hPassword, ePrivateKey, salt, ...result } = user
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

  async isUserOwnCollection(userId: number, collectionId: number) {
    const collection = await this.prismaService.collection.findUnique({
      where: { id: collectionId },
    })
    if (!collection || collection.userId !== userId) return false
    return true
  }
}
