import { Injectable } from '@nestjs/common'
import { ethers } from 'ethers'
import { abi, bytecode } from 'foundry-tk'

@Injectable()
export class CryptoService {
  private provider
  // TODO: Need to handle providers differently and
  // change networks dynamically
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
  }

  // Default first wallet that anvil provides for testing purposes
  createAnvilWalletZero() {
    return new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
  }

  createEthereumWallet() {
    return ethers.Wallet.createRandom()
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
