import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UserOwnsCollection } from './user-owns-collection.guard'
import { PrismaService } from 'src/prisma.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CollectionDto, EditCollectionDto } from './collection-dto'
import { CollectionService } from './collection.service'
import { User } from './user.decorator'
import { DeleteCollectionImagesInterceptor } from './delete-collection-images.interceptor'
import to from 'await-to-js'
import { CollectionExistsGuard } from './collection-exists.guard'

@Controller('collection')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(
    private collectionService: CollectionService,
    private prismaService: PrismaService,
  ) {}

  @Get(':collectionId')
  @UseGuards(CollectionExistsGuard)
  getColletionData(@Param('collectionId', ParseIntPipe) collectionId: number) {
    return this.prismaService.collection.findUnique({
      where: { id: collectionId },
    })
  }

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
  @UseInterceptors(DeleteCollectionImagesInterceptor)
  async deleteCollection(
    @Param('collectionId', ParseIntPipe) collectionId: number,
  ) {
    const deleteNfts = this.prismaService.nft.deleteMany({
      where: { collectionId },
    })
    const deleteCollection = this.prismaService.collection.delete({
      where: { id: collectionId },
    })

    const [err] = await to(
      this.prismaService.$transaction([deleteNfts, deleteCollection]),
    )
    if (err) throw new InternalServerErrorException()

    return { collectionId: collectionId, success: true }
  }
}
