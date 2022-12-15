import { BadRequestException, Injectable } from '@nestjs/common'
import { Nft } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class MetadataService {
  constructor(private prismaService: PrismaService) {}

  async getMetadataForCollection(collectionId: number) {
    const collectionNfts =
      await this.prismaService.collection.findUniqueOrThrow({
        where: { id: collectionId },
        include: { Nft: true },
      })

    if (!this.isCollectionMetadataComplete(collectionNfts.Nft))
      throw new BadRequestException('Not all nfts complete')

    return collectionNfts.Nft.map((nft) =>
      this.transformNftToJsonMetadata(nft, collectionNfts.name),
    )
  }

  async getMetadataForSpecificNft(collectionId: number, tokenId: number) {
    const nft = await this.prismaService.nft.findUniqueOrThrow({
      where: { collectionId_tokenId: { collectionId, tokenId } },
      include: { collection: { select: { name: true } } },
    })
    return this.transformNftToJsonMetadata(nft, nft.collection.name)
  }

  isCollectionMetadataComplete(nfts: Nft[]) {
    const doAllNftsHaveImage = nfts.every((nft) => nft.image)
    const doAllNftsHaveAttributes = nfts.every((nft) => nft.attributes)

    if (!doAllNftsHaveAttributes || !doAllNftsHaveImage) return false

    return true
  }

  transformNftToJsonMetadata(nft: Nft, collectionName: string) {
    return {
      name: `${collectionName} #${nft.tokenId}`,
      image: nft.image,
      attributes: nft.attributes,
    }
  }
}
