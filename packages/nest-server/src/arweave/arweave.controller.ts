import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UserOwnsCollection } from 'src/collection/user-owns-collection.guard'
import { OnlyIfDeployedGuard } from './only-if-deployed.guard'
import { SufficientArBalanceGuard } from './sufficient-ar-balance.guard'
import { UploadImagesArweaveInterceptor } from './upload-images-arweave.interceptor'
import { LocalAuthGuard } from 'src/auth/local-auth.guard'
import { S3Service } from 'src/s3/s3.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CollectionExistsGuard } from 'src/collection/collection-exists.guard'
import { ArweaveService } from './arweave.service'

@Controller('arweave')
export class ArweaveController {
  constructor(
    private s3Service: S3Service,
    private arweaveService: ArweaveService,
  ) {}

  @Post('deploy/:collectionId')
  @UseGuards(
    LocalAuthGuard,
    UserOwnsCollection,
    OnlyIfDeployedGuard,
    SufficientArBalanceGuard,
  )
  @UseInterceptors(UploadImagesArweaveInterceptor)
  deployToArweave() {
    return { data: 'deploying to arweave' }
  }

  @UseGuards(JwtAuthGuard, CollectionExistsGuard)
  @Get('estimate/:collectionId')
  async estimateDeployToArweavePriceInWinston(
    @Param('collectionId', ParseIntPipe) collectionId: number,
  ) {
    const bytesSize = await this.s3Service.calculatesBytesSizeFromPrefix(
      `${collectionId}/`,
    )
    const winstonPrice = await this.arweaveService.getPriceForNBytes(
      bytesSize,
      await this.arweaveService.generateArweavePrivateKey(),
    )
    return {
      winston: winstonPrice,
    }
  }
}
