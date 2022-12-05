import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CollectionExistsGuard } from 'src/collection/collection-exists.guard'
import { PrismaService } from 'src/prisma.service'
import { QueryDto } from './nft-dto'

@Controller('nft')
export class NftController {
  constructor(private prismaService: PrismaService) {}

  @Get(':collectionId')
  @UseGuards(CollectionExistsGuard)
  getNfts(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Query() { take, cursor, sort }: QueryDto,
  ) {
    return this.prismaService.nft.findMany({
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor
        ? {
            collectionId_tokenId: { collectionId, tokenId: +cursor },
          }
        : undefined,
      orderBy: { tokenId: sort },
    })
  }
}
