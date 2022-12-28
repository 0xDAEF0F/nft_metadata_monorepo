import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { JWKInterface } from 'arweave/node/lib/wallet'
import path from 'path'
import { tap } from 'rxjs'
import { AuthService } from 'src/auth/auth.service'
import { S3Service } from 'src/s3/s3.service'
import { ArweaveService } from './arweave.service'

@Injectable()
export class UploadImagesArweaveInterceptor implements NestInterceptor {
  constructor(
    private s3Service: S3Service,
    private arweaveService: ArweaveService,
    private authService: AuthService,
  ) {}

  async handleUploadImagesArweave(collectionId: number, arJWK: JWKInterface) {
    try {
      await this.s3Service.downloadObjectsFromPrefix(`${collectionId}/`)
      const dirPath = path.resolve(
        __dirname,
        '../../temp',
        collectionId.toString(),
      )
      const uploadResponse = await this.arweaveService.uploadFolderToArweave(
        dirPath,
        arJWK,
      )
      if (uploadResponse) console.log('manifest id: ', uploadResponse.id)
    } catch (error) {
      console.log(error)
    }
  }

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest()
    const credentials = req.body
    const { arweavePrivateKey } = await this.authService.ejectUser(credentials)
    const { collectionId } = req.params
    return next
      .handle()
      .pipe(
        tap(() =>
          this.handleUploadImagesArweave(collectionId, arweavePrivateKey),
        ),
      )
  }
}
