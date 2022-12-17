import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'
import { getAddress, isAddress } from 'ethers/lib/utils'
import { toLower, uniq } from 'lodash'

const WhiteListSchema = z.object({
  inviteList: z
    .array(
      z
        .string()
        .transform(toLower)
        .transform(getAddress)
        .refine(isAddress, 'invalid ethereum address'),
    )
    .min(0)
    .max(10_000)
    .transform(uniq),
})

export class WhiteListDto extends createZodDto(WhiteListSchema) {}
export class InviteOneAddressDto extends createZodDto(
  z.object({
    address: z
      .string()
      .transform(toLower)
      .transform(getAddress)
      .refine(isAddress, 'invalid ethereum address'),
  }),
) {}
