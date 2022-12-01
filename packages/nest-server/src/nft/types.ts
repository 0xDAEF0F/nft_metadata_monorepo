import { z } from 'nestjs-zod/z'
import validator from 'validator'

export const RecordSchema = z.object({
  id: z.number(),
})

const NormalAttributeSchema = z.object({
  trait_type: z.string().refine((tType) => validator.isUppercase(tType[0])),
  value: z.string().refine((val) => validator.isUppercase(val[0])),
})

const NumericAttributeSchema = z.object({
  trait_type: NormalAttributeSchema.shape.trait_type,
  value: z.number(),
})

const AttributeSchema = z.union([NormalAttributeSchema, NumericAttributeSchema])

export const NftAfterSanitationSchema = z.object({
  id: z.number(),
  attributes: z.array(AttributeSchema),
})

export type NftAfterSanitation = z.infer<typeof NftAfterSanitationSchema>
export type RecordDto = z.infer<typeof RecordSchema>
export type NormalAttribute = z.infer<typeof NormalAttributeSchema>
export type NumericAttribute = z.infer<typeof NumericAttributeSchema>
export type AssetUrl = string
export type NftAssetPayload = {
  tokenId: number
  collectionId: number
  data: Buffer
}
