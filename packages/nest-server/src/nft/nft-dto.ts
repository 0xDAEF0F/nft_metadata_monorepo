import is_number from 'is-number'
import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

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
