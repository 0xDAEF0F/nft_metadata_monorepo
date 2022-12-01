import {
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Param,
  ParseIntPipe,
  UploadedFiles,
  ParseFilePipeBuilder,
} from '@nestjs/common'
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { Prisma } from '@prisma/client'
import { parse } from 'csv/sync'
import { findIndex, partition } from 'lodash'
import { z } from 'nestjs-zod/z'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserOwnsCollection } from 'src/collection/user-owns-collection.guard'
import { PrismaService } from 'src/prisma.service'
import { UtilService } from 'src/util/util.service'
import { NftService } from './nft.service'
import { RecordSchema, NftAfterSanitationSchema } from './types'

@Controller('nft')
@UseGuards(JwtAuthGuard)
export class NftController {
  constructor(
    private nftService: NftService,
    private prismaService: PrismaService,
    private utilService: UtilService,
  ) {}

  @Post('/batch-create-metadata/:collectionId')
  @UseGuards(UserOwnsCollection)
  @UseInterceptors(FileInterceptor('file'))
  async batchCreateNftsMetadata(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'csv' })
        .build({ fileIsRequired: true }),
    )
    file: Express.Multer.File,
    @Param('collectionId', ParseIntPipe) collectionId: number,
  ) {
    const records = parse(file.buffer, {
      columns: (header) => {
        const capitalized = this.nftService.capitalizeHeader(header)
        return this.nftService.sanitizeRecordId(capitalized)
      },
      onRecord: (record) => {
        return Object.fromEntries(
          this.nftService.sanitizeRecordIdValues(
            Object.entries(record).filter(([, v]) => Boolean(v)),
          ),
        )
      },
    })

    const validatedRecords = z
      .array(RecordSchema.passthrough())
      .safeParse(records)

    if (!validatedRecords.success)
      throw new BadRequestException('ids have a non number value')

    const transformedRecords = this.nftService.transformRecordAttributes(
      validatedRecords.data,
    )

    const validatedTransformRecords = z
      .array(NftAfterSanitationSchema)
      .safeParse(transformedRecords)

    if (!validatedTransformRecords.success)
      throw new BadRequestException('attributes are incorrect')

    // 1. first delete all of the nfts
    await this.prismaService.collection.update({
      where: { id: collectionId },
      data: { Nft: { deleteMany: {} } },
    })

    // 2. Create all nfts
    const txn = await this.prismaService.collection.update({
      where: { id: collectionId },
      select: { _count: true },
      data: {
        Nft: {
          createMany: {
            data: validatedTransformRecords.data.map((nft) => ({
              tokenId: nft.id,
              attributes: nft.attributes as Prisma.JsonArray,
            })),
          },
        },
      },
    })

    return txn
  }

  @Post('batch-create-images/:collectionId')
  @UseGuards(UserOwnsCollection)
  @UseInterceptors(AnyFilesInterceptor())
  async batchCreateNftImages(
    @UploadedFiles()
    assets: Express.Multer.File[],
    @Param('collectionId', ParseIntPipe) collectionId: number,
  ) {
    const requestAssetIds = assets.map((a) => a.originalname.split('.')[0])
    if (!this.utilService.isArrayInSequence(requestAssetIds))
      throw new BadRequestException('assets are not in sequence')

    const collectionNfts = await this.prismaService.nft.findMany({
      where: { collectionId },
      select: { tokenId: true },
    })
    // new ones need creation and uploading to aws
    // duplicate ones need to be deleted from aws and re-uploaded
    const [duplicateTokenIds, newTokenIds] = partition(
      requestAssetIds,
      (currentAssetNft) => {
        const idxInStore = collectionNfts.findIndex(
          ({ tokenId }) => tokenId === +currentAssetNft,
        )
        const itExistsInDb = idxInStore !== -1
        return itExistsInDb
      },
    )
    return 'processing images'
  }
}
