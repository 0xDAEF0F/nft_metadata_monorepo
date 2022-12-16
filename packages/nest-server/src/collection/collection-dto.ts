import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'
import validator from 'validator'
import { Network, Standard } from '@prisma/client'
import { upperFirst } from 'lodash'

const CreateCollectionSchema = z.object({
  name: z.string().min(4).transform(upperFirst),
})

const EditCollectionSchema = CreateCollectionSchema.extend({
  description: z.string().optional(),
  externalUrl: z
    .string()
    .optional()
    .refine((url) => {
      if (!url) return true
      return validator.isURL(url)
    }, 'Invalid Url'),
  image: z.string().refine(validator.isURL, 'Invalid Url').optional(),
  standard: z.nativeEnum(Standard).optional(),
  network: z.nativeEnum(Network).optional(),
})

export class CollectionDto extends createZodDto(CreateCollectionSchema) {}
export class EditCollectionDto extends createZodDto(EditCollectionSchema) {}
