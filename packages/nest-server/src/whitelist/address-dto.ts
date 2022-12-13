import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'
import { isAddress } from 'ethers/lib/utils'
import { toLower, uniq } from 'lodash'

const WhiteListSchema = z.object({
  inviteList: z
    .array(
      z
        .string()
        .transform(toLower)
        .refine(isAddress, 'invalid ethereum address'),
    )
    .min(0)
    .max(10_000)
    .transform(uniq),
})

export class WhiteListDto extends createZodDto(WhiteListSchema) {}
