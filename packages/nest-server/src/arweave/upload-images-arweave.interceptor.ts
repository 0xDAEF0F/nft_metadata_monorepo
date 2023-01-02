import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import path from 'path'
import { tap } from 'rxjs'
import { MetadataService } from 'src/metadata/metadata.service'
import { PrismaService } from 'src/prisma.service'
import { S3Service } from 'src/s3/s3.service'
import { BundlrService } from './bundlr.service'

@Injectable()
export class UploadImagesArweaveInterceptor implements NestInterceptor {
  constructor(
    private s3Service: S3Service,
    private bundlrService: BundlrService,
    private metadataService: MetadataService,
    private prismaService: PrismaService,
  ) {}

  async handleUploadImagesArweave(collectionId: number) {
    const dirPath = path.resolve(__dirname, '../../temp')
    try {
      const { name: collectionName } =
        await this.prismaService.collection.findUniqueOrThrow({
          where: { id: collectionId },
          select: { name: true },
        })
      await this.s3Service.downloadObjectsFromPrefix(`${collectionId}/`)
      const uploadResponse = await this.bundlrService.uploadFolder(
        path.join(dirPath, 'images', collectionId.toString()),
      )
      if (!uploadResponse) throw new Error('no upload response for images')
      await this.metadataService.downloadMetadataForArweaveUpload(
        collectionId,
        collectionName,
        uploadResponse.id,
      )
      const metadataUploadResponse = await this.bundlrService.uploadFolder(
        path.join(dirPath, 'metadata', collectionId.toString()),
      )
      if (!metadataUploadResponse)
        throw new Error('no upload response for metadata')

      await this.metadataService.setMetadataUrlWithUploadTxn(
        metadataUploadResponse.id,
        collectionId,
      )

      console.log('all set')
    } catch (error) {
      console.log(error)
    }
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest()
    const { collectionId } = req.params
    return next
      .handle()
      .pipe(tap(() => this.handleUploadImagesArweave(+collectionId)))
  }
}
