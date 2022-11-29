import { Injectable } from '@nestjs/common'
import isNumber from 'is-number'
import validator from 'validator'
import { UtilService } from 'src/util/util.service'
import {
  NftAfterSanitation,
  NormalAttribute,
  NumericAttribute,
  RecordDto,
} from './types'

@Injectable()
export class NftService {
  constructor(private util: UtilService) {}

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
