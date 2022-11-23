import {
  Body,
  Controller,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
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

  @Put('edit')
  async editCollection(
    @User('id') id: number,
    @Body() editCollectionDto: EditCollectionDto,
  ) {
    const { studioId } = await this.prismaService.collection.findUniqueOrThrow({
      where: { id: editCollectionDto.id },
      select: { studioId: true },
    })
    if (studioId !== id) throw new UnauthorizedException()
    return this.collectionService.updateCollection(editCollectionDto, id)
  }
}
