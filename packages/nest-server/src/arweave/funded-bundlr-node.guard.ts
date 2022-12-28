import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { AuthService } from 'src/auth/auth.service'
import { CredentialsDto } from 'src/auth/credentials-dto'
import { S3Service } from 'src/s3/s3.service'
import { BundlrService } from './bundlr.service'

// @Notice: This guard assumes that a JWT has already been verified,
// that a user exists in the request, and that it has a complete
// image collection deployed to S3.
@Injectable()
export class FundedBundlrNodeGuard implements CanActivate {
  constructor(private s3Service: S3Service, private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    // LocalAuthGuard injected this property
    const user: User = request.user
    // Since it passed first through LocalAuthGuard it means credentials are already validated
    const credentials: CredentialsDto = request.body
    const { arweavePrivateKey } = await this.authService.ejectUser(credentials)

    const bundlr = new BundlrService(arweavePrivateKey)

    const imageBytes = await this.s3Service.calculatesBytesSizeFromPrefix(
      request.params.collectionId + '/',
    )

    const balance = await bundlr.getBalance(user.arweaveAddress)
    const costToUpload = await bundlr.getPrice(imageBytes)

    if (balance.gte(costToUpload)) return true

    throw new BadRequestException('Insufficient AR balance in Bundlr Node.')
  }
}
