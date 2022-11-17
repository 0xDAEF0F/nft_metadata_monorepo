import { Injectable } from '@nestjs/common'
import { ethers } from 'ethers'

@Injectable()
export class CryptoService {
  createEthereumWallet() {
    return ethers.Wallet.createRandom()
  }
}
