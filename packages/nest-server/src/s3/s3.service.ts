import {
  ListBucketsCommand,
  ListObjectsCommand,
  S3Client,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { InjectAws } from 'aws-sdk-v3-nest'
import { chunk } from 'lodash'

@Injectable()
export class S3Service {
  constructor(@InjectAws(S3Client) private readonly s3: S3Client) {}

  async helloAws() {
    const listCommand = new ListBucketsCommand({})
    const res = await this.s3.send(listCommand)
    return res
  }

  async listAllObjects() {
    const bucketParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Marker: undefined,
    }
    const objectKeys: { Key: string }[] = []
    let truncated = true
    let pageMarker
    while (truncated) {
      try {
        const response = await this.s3.send(
          new ListObjectsCommand(bucketParams),
        )
        if (!response.Contents) break
        response.Contents.forEach((item) => {
          if (!item.Key) return
          objectKeys.push({ Key: item.Key })
        })
        truncated = !!response.IsTruncated
        if (truncated) {
          pageMarker = response.Contents.slice(-1)[0].Key
          bucketParams.Marker = pageMarker
        }
      } catch (err) {
        console.log('Error', err)
        truncated = false
      }
    }
    return objectKeys
  }

  async emptyBucket() {
    const bucketObjectKeys = await this.listAllObjects()
    const inChunksOf1000 = chunk(bucketObjectKeys, 1000)
    inChunksOf1000.forEach((chunk) => {
      const command = new DeleteObjectsCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: { Objects: chunk },
      })
      this.s3.send(command)
    })
  }
}
