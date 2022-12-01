import { Injectable } from '@nestjs/common'
import isNumber from 'is-number'
import validator from 'validator'
import { UtilService } from 'src/util/util.service'
import {
  NftAssetPayload,
  NftAfterSanitation,
  NormalAttribute,
  NumericAttribute,
  RecordDto,
} from './types'
import { S3Service } from 'src/s3/s3.service'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class NftService {
  constructor(
    private util: UtilService,
    private s3: S3Service,
    private prismaService: PrismaService,
  ) {}

  async createOrUpdateNftAsset(nftPayload: NftAssetPayload) {
    const { collectionId, tokenId, data } = nftPayload
    await this.s3.uploadObject(`${collectionId}/${tokenId}`, data)
    const {
      Nft: [token],
    } = await this.prismaService.collection.findUniqueOrThrow({
      where: { id: collectionId },
      select: { Nft: { where: { tokenId } } },
    })
    const imageUrl = this.getAwsAssetUrl(collectionId, tokenId)
    await this.prismaService.nft.upsert({
      where: { id: token.id },
      update: { image: imageUrl },
      create: { tokenId, image: imageUrl, collectionId },
    })
    return true
  }

  deleteNftAssets(collectionId: number, tokenIds: number[]) {
    return tokenIds.map((tokenId) => {
      return this.deleteNftAsset(collectionId, tokenId)
    })
  }

  deleteNftAsset(collectionId: number, tokenId: number) {
    const key = `${collectionId}/${tokenId}`
    return this.s3.deleteObject(key)
  }

  getAwsAssetUrl(collectionId: number, tokenId: number) {
    const basePath = `https://${this.s3.getBucketName()}.s3.amazonaws.com`
    return `${basePath}/${collectionId}/${tokenId}`
  }

  transformRecordAttributes(
    recordArray: Array<RecordDto>,
  ): Array<NftAfterSanitation> {
    return recordArray.map((record) => {
      const { id, ...rest } = record
      const allEntriesWithoutId = Object.entries<string>(rest)

      const normalAttr = this.extractNormalAttributes(allEntriesWithoutId)
      const numericAttr = this.extractNumericAttributes(allEntriesWithoutId)

      return {
        id,
        attributes: [...normalAttr, ...numericAttr],
      }
    })
  }

  extractNormalAttributes(
    entries: Array<[string, string]>,
  ): Array<NormalAttribute> {
    const stringEntries = entries.filter(([, v]) =>
      validator.isAlpha(v, 'en-US', { ignore: ' -_' }),
    )
    return stringEntries.map(([trait_type, value]) => ({
      trait_type: this.util.capitalizeFirstLetter(trait_type),
      value: this.util.capitalizeFirstLetter(value),
    }))
  }

  extractNumericAttributes(
    entries: Array<[string, string]>,
  ): Array<NumericAttribute> {
    const numericEntries = entries.filter(([, v]) => isNumber(v))
    return numericEntries.map(([trait_type, value]) => {
      return {
        trait_type: this.util.capitalizeFirstLetter(trait_type),
        value: Number(value),
      }
    })
  }

  sanitizeRecordIdValues(entries: [string, unknown][]) {
    return entries.map(([k, v]) => {
      if (k === 'id') return [k, Number(v)]
      return [k, v]
    })
  }

  capitalizeHeader(header: string[]) {
    return header.map((col) => this.util.capitalizeFirstLetter(col))
  }

  sanitizeRecordId(header: string[]) {
    const idIdx = header.findIndex(
      (col) => col === 'id' || col === 'ID' || col == 'Id',
    )
    return header.map((col, idx) => {
      if (idx === idIdx) return 'id'
      return col
    })
  }
}
