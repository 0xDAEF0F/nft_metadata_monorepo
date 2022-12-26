import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { isAddress } from 'ethers/lib/utils'
import { toLower } from 'lodash'
import { z } from 'nestjs-zod/z'

const EthereumAddressSchema = z
  .string()
  .transform(toLower)
  .refine(isAddress, 'invalid ethereum address')

@Injectable()
export class EthereumAddressExistsPipe implements PipeTransform {
  transform(address: string) {
    const parsed = EthereumAddressSchema.safeParse(address)

    if (!parsed.success) {
      console.log(parsed.error)
      throw new BadRequestException('invalid ethereum address')
    }

    return parsed.data
  }
}
