import { Injectable } from '@nestjs/common'
import { NftImagePayload } from './types'
import { S3Service } from 'src/s3/s3.service'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class ImageService {
  constructor(private s3: S3Service, private prismaService: PrismaService) {}

  async createOrUpdateNftImage(nftPayload: NftImagePayload) {
    const { collectionId, tokenId, data, imageName } = nftPayload

    await this.s3.uploadObject(`${collectionId}/${imageName}`, data)

    const imageUrl = this.getAwsImageUrl(collectionId, imageName)

    await this.prismaService.nft.upsert({
      where: { collectionId_tokenId: { collectionId, tokenId } },
      update: { image: imageUrl },
      create: { tokenId, image: imageUrl, collectionId },
    })
  }

  getAwsImageUrl(collectionId: number, key: string) {
    const basePath = `https://${this.s3.getBucketName()}.s3.amazonaws.com`
    return `${basePath}/${collectionId}/${key}`
  }
}
