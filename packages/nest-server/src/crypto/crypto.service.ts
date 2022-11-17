import { Injectable } from '@nestjs/common'
import { ethers } from 'ethers'
@Injectable()
export class CryptoService {
  private provider
  // TODO: Need to handle providers differently and
  // change networks dynamically
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
  }
  createEthereumWallet() {
    return ethers.Wallet.createRandom()
  }
  // TODO: need provider to deploy contract
  // need interface, bytecode and signer too
  async createERC1155Contract() {
    // const factory = new ethers.ContractFactory(
    //   MyERC1155Artifact.abi,
    //   MyERC1155Artifact.bytecode,
    //   this.createEthereumWallet().connect(this.provider),
    // )
    // const deployedContract = await factory.deploy()
    // return deployedContract.deployTransaction
    return { hash: '0x123' }
  }
}
