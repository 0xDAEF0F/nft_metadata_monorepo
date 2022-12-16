import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'
import validator from 'validator'

const ErcStandard = {
  ERC1155: 'ERC1155',
  ERC722: 'ERC721',
} as const

const CreateCollectionSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  externalUrl: z
    .string()
    .optional()
    .refine((url) => {
      if (!url) return true
      return validator.isURL(url)
    }, 'Invalid Url'),
  image: z.string().refine(validator.isURL, 'Invalid Url').optional(),
  standard: z.nativeEnum(ErcStandard).optional(),
})

const EditCollectionSchema = CreateCollectionSchema.partial()

export class CollectionDto extends createZodDto(CreateCollectionSchema) {}
export class EditCollectionDto extends createZodDto(EditCollectionSchema) {}
