import { Injectable } from '@nestjs/common'
import Arweave from 'arweave'

@Injectable()
export class ArweaveService extends Arweave {
  constructor() {
    super({ host: 'arweave.net', port: 443, protocol: 'https' })
  }
}
