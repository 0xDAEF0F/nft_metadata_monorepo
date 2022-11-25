import { Controller, Delete, Get } from '@nestjs/common'
import { S3Service } from './s3/s3.service'

@Controller()
export class AppController {
  constructor(private s3Service: S3Service) {}

  @Get()
  helloAws() {
    return this.s3Service.listAllObjects()
  }

  @Delete()
  emptyBucket() {
    this.s3Service.emptyBucket()
    return 'OK'
  }
}
