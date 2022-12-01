import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { UserOwnsCollection } from './user-owns-collection.guard'
import { PrismaService } from 'src/prisma.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CollectionDto, EditCollectionDto } from './collection-dto'
import { CollectionService } from './collection.service'
import { User } from './user.decorator'

@Controller('collection')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(
    private collectionService: CollectionService,
    private prismaService: PrismaService,
  ) {}

  @Post('create')
  createCollection(
    @User('id') id: number,
    @Body() createCollectionDto: CollectionDto,
  ) {
    return this.collectionService.createCollection(createCollectionDto, id)
  }

  @Put('edit/:collectionId')
  @UseGuards(UserOwnsCollection)
  async editCollection(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Body() editCollectionDto: EditCollectionDto,
  ) {
    return this.collectionService.updateCollection(
      editCollectionDto,
      collectionId,
    )
  }

  @Delete('delete/:collectionId')
  @UseGuards(UserOwnsCollection)
  async deleteCollection(@Param('collectionId', ParseIntPipe) id: number) {
    // 1. delete all related Attributes and NFTs
    await this.prismaService.collection.update({
      where: { id },
      data: { Nft: { deleteMany: {} } },
    })
    // 2. delete the collection
    await this.prismaService.collection.delete({ where: { id } })

    return { collectionId: id, success: true }
  }
}