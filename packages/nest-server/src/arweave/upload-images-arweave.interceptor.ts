import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import path from 'path'
import { tap } from 'rxjs'
import { S3Service } from 'src/s3/s3.service'
import { BundlrService } from './bundlr.service'

@Injectable()
export class UploadImagesArweaveInterceptor implements NestInterceptor {
  constructor(
    private s3Service: S3Service,
    private bundlrService: BundlrService,
  ) {}

  async handleUploadImagesArweave(collectionId: number) {
    try {
      await this.s3Service.downloadObjectsFromPrefix(`${collectionId}/`)
      const dirPath = path.resolve(
        __dirname,
        '../../temp',
        collectionId.toString(),
      )
      const uploadResponse = await this.bundlrService.uploadFolder(dirPath)

      if (uploadResponse) console.log('manifest id: ', uploadResponse.id)
    } catch (error) {
      console.log(error)
    }
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest()
    const { collectionId } = req.params
    return next
      .handle()
      .pipe(tap(() => this.handleUploadImagesArweave(collectionId)))
  }
}
