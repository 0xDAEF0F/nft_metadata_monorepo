export type NftImagePayload = {
  imageName: string
  tokenId: number
  collectionId: number
  data: Buffer
}

export enum TypeOfBatchMetadataRequest {
  creation,
  updating,
  both,
}
