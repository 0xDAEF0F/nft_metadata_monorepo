import { BadRequestException, Injectable } from '@nestjs/common'
import { QueryDto } from 'src/nft/nft-dto'
import { PrismaService } from '../prisma.service'
import { CollectionDto, EditCollectionDto } from './collection-dto'

@Injectable()
export class CollectionService {
  constructor(private prismaService: PrismaService) {}

  getMany(userId: number, query: QueryDto) {
    const { take, cursor, sort } = query
    return this.prismaService.collection.findMany({
      where: { userId },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: +cursor } : undefined,
      orderBy: { id: sort },
      include: { Nft: { take: 1, select: { image: true } } },
    })
  }

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
