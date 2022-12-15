import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { MetadataService } from './metadata.service'

@Controller('metadata')
export class MetadataController {
  constructor(private metadataService: MetadataService) {}

  @Get(':collectionId')
  getMetadataForCollection(
    @Param('collectionId', ParseIntPipe) collectionId: number,
  ) {
    return this.metadataService.getMetadataForCollection(collectionId)
  }

  @Get(':collectionId/:tokenId')
  getMetadataForNft(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Param('tokenId', ParseIntPipe) tokenId: number,
  ) {
    return this.metadataService.getMetadataForSpecificNft(collectionId, tokenId)
  }
}
