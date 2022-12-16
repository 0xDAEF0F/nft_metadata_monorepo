import {
  Controller,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CollectionAlreadyDeployedGuard } from 'src/collection/collection-already-deployed.guard'
import { UserOwnsCollection } from 'src/collection/user-owns-collection.guard'
import { AttributesService } from './attributes.service'

@UseGuards(JwtAuthGuard)
@Controller('attributes')
export class AttributesController {
  constructor(private attributesService: AttributesService) {}

  @Post('batch/:collectionId')
  @UseGuards(UserOwnsCollection, CollectionAlreadyDeployedGuard)
  @UseInterceptors(FileInterceptor('file'))
  async batchCreateNftAttributes(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'csv' })
        .build({ fileIsRequired: true }),
    )
    file: Express.Multer.File,
    @Param('collectionId', ParseIntPipe) collectionId: number,
  ) {
    const records = this.attributesService.transformFileToRecords(file.buffer)
    const partialNfts =
      this.attributesService.transformRecordsToPartialNfts(records)

    const dbTxn = await this.attributesService.upsertNftsAttributes(
      collectionId,
      partialNfts,
    )

    return dbTxn
  }
}
