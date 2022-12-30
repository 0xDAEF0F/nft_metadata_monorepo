import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { S3Service } from 'src/s3/s3.service'
import { BundlrService } from './bundlr.service'

@Injectable()
export class FundedBundlrNodeGuard implements CanActivate {
  constructor(
    private s3Service: S3Service,
    private bundlrService: BundlrService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    const imageBytes = await this.s3Service.calculateBytesSizeFromPrefix(
      request.params.collectionId + '/',
    )

    // cushion of 10%
    const priceToDeployToArweave = (
      await this.bundlrService.getPrice(imageBytes)
    )
      .times(1.1)
      .integerValue()
    const loadedBalance = await this.bundlrService.getLoadedBalance()

    if (priceToDeployToArweave.gt(loadedBalance))
      throw new BadRequestException('Insufficient AR balance in Bundlr Node.')

    return true
  }
}
