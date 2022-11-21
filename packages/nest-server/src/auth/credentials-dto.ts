import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'
import validator from 'validator'

const DeveloperAccountSchema = z.object({
  username: z.string().min(4).max(15),
  password: z
    .password()
    .min(8)
    .atLeastOne('uppercase')
    .atLeastOne('special')
    .atLeastOne('digit')
    .refine(validator.isAscii, {
      message: 'Password must conform to ASCII characters.',
    }),
})

export class CredentialsDto extends createZodDto(DeveloperAccountSchema) {}
