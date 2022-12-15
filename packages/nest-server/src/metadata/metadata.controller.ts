import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common'
import { MetadataService } from './metadata.service'
import { NftExistsGuard } from './nft-exists.guard'

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
  @UseGuards(NftExistsGuard)
  getMetadataForNft(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Param('tokenId', ParseIntPipe) tokenId: number,
  ) {
    return this.metadataService.getMetadataForSpecificNft(collectionId, tokenId)
  }
}
