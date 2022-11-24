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
    // TODO: add guard to prevent this edge case
    const { userId } = await this.prismaService.collection.findUniqueOrThrow({
      where: { id: editCollectionDto.id },
      select: { userId: true },
    })
    if (userId !== id) throw new UnauthorizedException()
    return this.collectionService.updateCollection(editCollectionDto, id)
  }
}
