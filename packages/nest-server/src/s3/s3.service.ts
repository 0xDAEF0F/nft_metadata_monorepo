import {
  ListObjectsCommand,
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  ListObjectsCommandInput,
  GetObjectCommandInput,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectAws } from 'aws-sdk-v3-nest'
import * as fs from 'fs'
import path from 'path'

@Injectable()
export class S3Service {
  constructor(
    @InjectAws(S3Client) private s3: S3Client,
    private configService: ConfigService,
  ) {}

  uploadObject(key: string, data: Buffer) {
    const uploadParams: PutObjectCommandInput = {
      Bucket: this.configService.getOrThrow<string>('AWS_BUCKET_NAME'),
      Key: key,
      Body: data,
    }
    return this.s3.send(new PutObjectCommand(uploadParams))
  }

  deleteObject(key: string) {
    const deleteParams: DeleteObjectCommandInput = {
      Bucket: this.configService.getOrThrow<string>('AWS_BUCKET_NAME'),
      Key: key,
    }
    return this.s3.send(new DeleteObjectCommand(deleteParams))
  }

  async listObjectsFromPrefix(prefix: string) {
    const bucketName = this.configService.getOrThrow<string>('AWS_BUCKET_NAME')
    const bucketParams: ListObjectsCommandInput = {
      Bucket: bucketName,
      Marker: undefined,
      Prefix: prefix,
    }
    const objects: string[] = []
    while (true) {
      const objectListing = await this.s3.send(
        new ListObjectsCommand(bucketParams),
      )
      if (!objectListing.Contents) break
      objectListing.Contents.forEach(async (obj) => {
        if (!obj.Key) return
        objects.push(obj.Key)
      })
      if (objectListing.IsTruncated) {
        bucketParams.Marker = objectListing.Contents.slice(-1)[0].Key
      } else {
        break
      }
    }
    return objects
  }

  async downloadObjectsFromPrefix(prefix: string): Promise<void> {
    const objects = await this.listObjectsFromPrefix(prefix)

    for (let i = 0; i < objects.length; i++) {
      const params: GetObjectCommandInput = {
        Bucket: this.configService.getOrThrow<string>('AWS_BUCKET_NAME'),
        Key: objects[i],
      }
      const data = await this.s3.send(new GetObjectCommand(params))
      if (!data.Body) return
      const dataByteArray = await data.Body.transformToByteArray()

      const collectionId = objects[i].split('/')[0]
      const dirPath = path.resolve(__dirname, '../../temp', collectionId)

      if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })

      fs.writeFileSync(
        path.join(dirPath, objects[i].split('/')[1]),
        dataByteArray,
      )
    }
  }

  async deleteObjectsFromPrefix(prefix: string) {
    const keys = await this.listObjectsFromPrefix(prefix)
    for (let i = 0; i < keys.length; i++) {
      this.deleteObject(keys[i])
    }
  }
}
