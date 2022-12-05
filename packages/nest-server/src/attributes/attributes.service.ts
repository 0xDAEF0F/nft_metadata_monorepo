import { BadRequestException, Injectable } from '@nestjs/common'
import { parse } from 'csv/sync'
import isNumber from 'is-number'
import validator from 'validator'
import { UtilService } from 'src/util/util.service'
import {
  PartialNftWithAttributes,
  RecordSchema,
  NormalAttribute,
  NumericAttribute,
} from './types'
import { z } from 'nestjs-zod/z'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class AttributesService {
  constructor(
    private prismaService: PrismaService,
    private util: UtilService,
  ) {}

  upsertNftsAttributes(collectionId: number, nfts: PartialNftWithAttributes[]) {
    return this.prismaService.collection.update({
      where: { id: collectionId },
      data: {
        Nft: {
          upsert: nfts.map((a) => ({
            where: { collectionId_tokenId: { collectionId, tokenId: a.id } },
            create: { tokenId: a.id, attributes: a.attributes },
            update: { attributes: a.attributes },
          })),
        },
      },
      include: { _count: true },
    })
  }

  transformRecordsToPartialNfts(recordArray: { id: number }[]) {
    const nfts = recordArray.map((record) => {
      const { id, ...rest } = record
      const allEntriesWithoutId = Object.entries<string>(rest)

      const normalAttr = this.extractNormalAttributes(allEntriesWithoutId)
      const numericAttr = this.extractNumericAttributes(allEntriesWithoutId)

      return {
        id,
        attributes: [...normalAttr, ...numericAttr],
      }
    })

    const maybeValidatedPartialNfts = z
      .array(PartialNftWithAttributes)
      .safeParse(nfts)

    if (!maybeValidatedPartialNfts.success)
      throw new BadRequestException('fail to transform nfts')

    if (maybeValidatedPartialNfts.data.length === 0)
      throw new BadRequestException('no nfts to process')

    return maybeValidatedPartialNfts.data
  }

  transformFileToRecords(buffer: Buffer) {
    const records = parse(buffer, {
      columns: (header) => {
        const capitalized = this.capitalizeHeader(header)
        return this.sanitizeRecordId(capitalized)
      },
      onRecord: (record) => {
        return Object.fromEntries(
          this.sanitizeRecordIdValues(
            Object.entries(record).filter(([, v]) => Boolean(v)),
          ),
        )
      },
    })

    const maybeValidatedRecords = z
      .array(RecordSchema.passthrough())
      .safeParse(records)

    if (!maybeValidatedRecords.success)
      throw new BadRequestException('non id nfts')

    return maybeValidatedRecords.data
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
