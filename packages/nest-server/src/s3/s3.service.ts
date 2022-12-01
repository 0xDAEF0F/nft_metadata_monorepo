import {
  ListObjectsCommand,
  S3Client,
  DeleteObjectsCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  ListObjectsCommandInput,
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { InjectAws } from 'aws-sdk-v3-nest'
import { chunk } from 'lodash'

@Injectable()
export class S3Service {
  constructor(@InjectAws(S3Client) private readonly s3: S3Client) {}

  getBucketName() {
    return process.env.AWS_BUCKET_NAME as string
  }

  uploadObject(key: string, data: Buffer) {
    const uploadParams: PutObjectCommandInput = {
      Bucket: this.getBucketName(),
      Key: key,
      Body: data,
    }
    return this.s3.send(new PutObjectCommand(uploadParams))
  }

  deleteObject(key: string) {
    const deleteParams: DeleteObjectCommandInput = {
      Bucket: this.getBucketName(),
      Key: key,
    }
    return this.s3.send(new DeleteObjectCommand(deleteParams))
  }

  async deleteObjectsFromPrefix(prefix: string) {
    const bucketParams: ListObjectsCommandInput = {
      Bucket: this.getBucketName(),
      Marker: undefined,
      Prefix: prefix,
    }
    while (true) {
      const objectListing = await this.s3.send(
        new ListObjectsCommand(bucketParams),
      )
      if (!objectListing.Contents) break
      objectListing.Contents.forEach((obj) => {
        const key = obj.Key
        if (!key) return
        this.deleteObject(key)
      })
      if (objectListing.IsTruncated) {
        bucketParams.Marker = objectListing.Contents.slice(-1)[0].Key
      } else {
        break
      }
    }
  }

  async listAllObjects() {
    const bucketParams = {
      Bucket: this.getBucketName(),
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
        Bucket: this.getBucketName(),
        Delete: { Objects: chunk },
      })
      this.s3.send(command)
    })
  }
}
