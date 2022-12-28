import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { S3Service } from 'src/s3/s3.service'
import { ArweaveService } from './arweave.service'

// @Notice: This guard assumes that a JWT has already been verified,
// that a user exists in the request, and that it has a complete
// image collection deployed to S3.
@Injectable()
export class SufficientArBalanceGuard implements CanActivate {
  constructor(
    private prismaService: PrismaService,
    private arweaveService: ArweaveService,
    private s3Service: S3Service,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: +request.user.id },
    })
    const arBalance = +(await this.arweaveService.getArBalanceFromAddress(
      user.arweaveAddress,
    ))
    const imageBytes = await this.s3Service.calculatesBytesSizeFromPrefix(
      request.params.collectionId + '/',
    )
    const totalCostToUpload = +(await this.arweaveService.getPriceForNBytes(
      imageBytes,
      await this.arweaveService.generateArweavePrivateKey(),
    ))
    if (arBalance >= totalCostToUpload) return true

    throw new BadRequestException('insufficient ar balance')
  }
}
