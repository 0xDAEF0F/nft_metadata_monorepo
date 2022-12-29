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
import { ArweaveService } from './arweave.service'
import { BundlrService } from './bundlr.service'

@Injectable()
export class EnoughArToFundBundlrGuard implements CanActivate {
  constructor(
    private s3Service: S3Service,
    private authService: AuthService,
    private arweaveService: ArweaveService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    // LocalAuthGuard injected this property
    const user: User = request.user
    // Since it passed first through LocalAuthGuard it means credentials are already validated
    const credentials: CredentialsDto = request.body
    const { arweavePrivateKey } = await this.authService.ejectUser(credentials)

    const bundlr = new BundlrService(arweavePrivateKey)

    const arBalance = +(await this.arweaveService.getArBalanceFromAddress(
      user.arweaveAddress,
    ))

    const imageBytes = await this.s3Service.calculatesBytesSizeFromPrefix(
      request.params.collectionId + '/',
    )
    const costToUpload = (await bundlr.getPrice(imageBytes)).toNumber()

    // console.log({ arBalance, costToUpload, imageBytes })

    if (arBalance >= costToUpload * 1.03) return true

    throw new BadRequestException(
      'Insufficient AR balance in wallet to fund Bundlr',
    )
  }
}
