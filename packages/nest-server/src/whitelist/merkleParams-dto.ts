import { getAddress, isAddress } from 'ethers/lib/utils'
import { toLower } from 'lodash'
import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const MerkleQuerySchema = z.object({
  address: z
    .string()
    .transform(toLower)
    .transform(getAddress)
    .refine(isAddress, 'invalid ethereum address'),
})

export class MerkleQueryDto extends createZodDto(MerkleQuerySchema) {}
