import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common'
import { AnyFilesInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CollectionAlreadyDeployedGuard } from 'src/collection/collection-already-deployed.guard'
import { UserOwnsCollection } from 'src/collection/user-owns-collection.guard'
import { UtilService } from 'src/util/util.service'
import { imageOptions } from './multer-options'
import { NftImageInterceptor } from './nftImage.interceptor'

@Controller('image')
@UseGuards(JwtAuthGuard)
export class ImageController {
  constructor(private utilService: UtilService) {}

  @Post('batch/:collectionId')
  @UseGuards(UserOwnsCollection, CollectionAlreadyDeployedGuard)
  @UseInterceptors(AnyFilesInterceptor(imageOptions), NftImageInterceptor) // this interceptor does the heavy lifting in aws (non blocking request)
  batchCreateNftImages(
    @UploadedFiles()
    assets: Express.Multer.File[],
  ) {
    if (!assets || assets.length === 0)
      throw new BadRequestException('no images to process')

    const requestAssetIds = assets.map((a) => a.originalname.split('.')[0])
    if (!this.utilService.isArrayInSequence(requestAssetIds))
      throw new BadRequestException('assets are not in sequence')

    return { data: 'processing images' }
  }
}
