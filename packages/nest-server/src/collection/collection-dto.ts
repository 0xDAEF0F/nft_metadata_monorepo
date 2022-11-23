import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const CreateCollectionSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  externalUrl: z.string().optional(),
  image: z.string().optional(),
})

export class CollectionDto extends createZodDto(CreateCollectionSchema) {}
