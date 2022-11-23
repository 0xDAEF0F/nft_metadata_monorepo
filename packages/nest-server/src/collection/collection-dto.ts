import { createZodDto } from 'nestjs-zod'
import * as z from 'nestjs-zod/z'

const ErcStandard = {
  ERC1155: 'ERC1155',
  ERC722: 'ERC721',
} as const

const CreateCollectionSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  externalUrl: z.string().optional(),
  image: z.string().optional(),
  standard: z.nativeEnum(ErcStandard).optional(),
})

const EditCollectionSchema = z
  .object({
    id: z.number(),
  })
  .merge(CreateCollectionSchema.partial())

export class CollectionDto extends createZodDto(CreateCollectionSchema) {}
export class EditCollectionDto extends createZodDto(EditCollectionSchema) {}
