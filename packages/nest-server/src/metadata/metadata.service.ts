import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { Nft } from '@prisma/client'
import to from 'await-to-js'
import { ImageService } from 'src/nftImage/nftImage.service'
import { PrismaService } from 'src/prisma.service'
import { S3Service } from 'src/s3/s3.service'

@Injectable()
export class MetadataService {
  constructor(
    private prismaService: PrismaService,
    private s3Service: S3Service,
    private imageService: ImageService,
  ) {}

  async uploadMetadataForNft(collectionId: number, tokenId: number) {
    const nftJson = await this.getMetadataForSpecificNft(collectionId, tokenId)

    const [err] = await to(
      this.s3Service.uploadObject(
        `${collectionId}/${tokenId}.json`,
        Buffer.from(JSON.stringify(nftJson)),
      ),
    )
    if (err) {
      console.log(err)
      throw new InternalServerErrorException('error uploading metadata to aws')
    }

    const jsonURL = this.imageService.getAwsImageUrl(
      collectionId,
      `${tokenId}.json`,
    )

    const updatedNft = await this.prismaService.nft.update({
      where: { collectionId_tokenId: { collectionId, tokenId } },
      data: { metadataUrl: jsonURL },
    })

    return updatedNft
  }

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

    if (!this.isNftMetadataComplete(nft))
      throw new BadRequestException('incomplete metadata')

    return this.transformNftToJsonMetadata(nft, nft.collection.name)
  }

  isCollectionMetadataComplete(nfts: Nft[]) {
    return nfts.every(this.isNftMetadataComplete)
  }

  isCollectionNumberedCorrectly(nfts: Nft[]) {
    const idWithIndex = nfts.map((a, i) => [a.tokenId, i])
    return idWithIndex.every(([tokenId, index]) => tokenId === index)
  }

  isNftMetadataComplete(nft: Nft) {
    if (!nft.attributes) return false
    if (!nft.image) return false
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
