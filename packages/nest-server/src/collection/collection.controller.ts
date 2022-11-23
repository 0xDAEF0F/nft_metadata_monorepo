import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CollectionDto } from './collection-dto'
import { CollectionService } from './collection.service'
import { User } from './user.decorator'

@Controller('collection')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Post('create')
  createCollection(
    @User('id') id: number,
    @Body() createCollectionDto: CollectionDto,
  ) {
    return this.collectionService.createCollection(createCollectionDto, id)
  }
}
