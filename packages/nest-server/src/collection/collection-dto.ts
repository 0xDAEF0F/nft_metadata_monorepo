import is_number from 'is-number'
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
  externalUrl: z.string().refine(validator.isURL, 'Invalid Url').optional(),
  image: z.string().refine(validator.isURL, 'Invalid Url').optional(),
  standard: z.nativeEnum(ErcStandard).optional(),
})

const EditCollectionSchema = CreateCollectionSchema.partial()

const QueryDtoSchema = z.object({
  take: z.string().optional().default('50').refine(is_number).transform(Number),
  cursor: z
    .string()
    .optional()
    .refine((arg) => {
      if (arg === undefined) return true
      return is_number(arg)
    }),
  sort: z.enum(['asc', 'desc']).optional().default('asc'),
})

export class QueryDto extends createZodDto(QueryDtoSchema) {}
export class CollectionDto extends createZodDto(CreateCollectionSchema) {}
export class EditCollectionDto extends createZodDto(EditCollectionSchema) {}
