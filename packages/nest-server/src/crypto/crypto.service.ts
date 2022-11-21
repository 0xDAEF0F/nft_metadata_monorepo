import { Injectable } from '@nestjs/common'
import { scrypt } from 'scrypt-js'
import * as aesjs from 'aes-js'
import { ethers } from 'ethers'
import { abi, bytecode } from 'foundry-tk'
@Injectable()
export class CryptoService {
  private provider
  // TODO: Need to handle providers differently and
  // change networks dynamically
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(
      'http://localhost:8545',
    )
  }

  // Default first wallet that anvil provides for testing purposes
  createAnvilWalletZero() {
    return new ethers.Wallet(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    )
  }

  async deriveKeyFromHumanReadablePassword(password: string) {
    const pass = Buffer.from(password)
    // TODO: How to deal with salt?
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

  // Creates a new contract instance of our smart contract
  // defined in foundry-tk package
  async createERC1155Contract() {
    const factory = new ethers.ContractFactory(
      new ethers.utils.Interface(abi),
      bytecode,
      this.createAnvilWalletZero().connect(this.provider),
    )
    const deployedContract = await factory.deploy()
    return deployedContract.deployTransaction
  }
}
