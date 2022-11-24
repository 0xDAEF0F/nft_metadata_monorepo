import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const CreateAttributeSchema = z.object({
  // if this is nullish then it will have a generic value
  traitType: z.string().nullish(),
  value: z.string(),
  // if you want to link the attribute to a specific NFT
  nftId: z.number().nullish(),
})

export class CreateAttributeDto extends createZodDto(CreateAttributeSchema) {}
