import {
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { parse } from 'csv/sync'
import { z } from 'nestjs-zod/z'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserOwnsCollection } from 'src/collection/user-owns-collection.guard'
import { UtilService } from 'src/util/util.service'
import { NftService } from './nft.service'
import { RecordSchema } from './types'

@Controller('nft')
@UseGuards(JwtAuthGuard)
export class NftController {
  constructor(private nftService: NftService) {}

  @Post('/batch-create-metadata/:collectionId')
  @UseGuards(UserOwnsCollection)
  @UseInterceptors(FileInterceptor('file'))
  batchCreateNftsMetadata(@UploadedFile() file: Express.Multer.File) {
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
    const validatedRecords = z.array(RecordSchema).safeParse(records)

    if (!validatedRecords.success)
      throw new BadRequestException('ids have a non number value')

    // now transform the other attributes
  }
}
