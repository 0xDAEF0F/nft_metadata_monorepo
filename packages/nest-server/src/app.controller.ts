import { Controller, All } from '@nestjs/common'
import { S3Service } from './s3/s3.service'
@Controller()
export class AppController {
  constructor(private s3Service: S3Service) {}

  @All()
  hello() {
    return 'hello world'
    // return this.s3Service.listAllObjects()
    // return this.s3Service.emptyBucket()
  }
}
