import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CollectionDto, EditCollectionDto } from './collection-dto'

@Injectable()
export class CollectionService {
  constructor(private prismaService: PrismaService) {}

  async createCollection(collectionDto: CollectionDto, userId: number) {
    const isCollectionExists = await this.prismaService.collection.findUnique({
      where: { name: collectionDto.name },
    })
    if (isCollectionExists)
      throw new BadRequestException('collection already exists')
    const createdCollection = await this.prismaService.collection.create({
      data: { ...collectionDto, userId },
    })
    return createdCollection
  }

  async updateCollection(
    collectionDto: EditCollectionDto,
    collectionId: number,
  ) {
    const collection = await this.prismaService.collection.update({
      data: { ...collectionDto },
      where: { id: collectionId },
    })
    return collection
  }
}
