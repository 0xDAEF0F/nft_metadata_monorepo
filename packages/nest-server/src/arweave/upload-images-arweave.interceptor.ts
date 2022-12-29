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
import { CredentialsDto } from 'src/auth/credentials-dto'
import { S3Service } from 'src/s3/s3.service'
import { BundlrService } from './bundlr.service'

@Injectable()
export class UploadImagesArweaveInterceptor implements NestInterceptor {
  constructor(private s3Service: S3Service, private authService: AuthService) {}

  async handleUploadImagesArweave(
    collectionId: number,
    credentials: CredentialsDto,
  ) {
    try {
      const { arweavePrivateKey } = await this.authService.ejectUser(
        credentials,
      )
      await this.s3Service.downloadObjectsFromPrefix(`${collectionId}/`)
      const dirPath = path.resolve(
        __dirname,
        '../../temp',
        collectionId.toString(),
      )
      const uploadResponse = await new BundlrService(
        arweavePrivateKey,
      ).uploadFolder(dirPath)

      if (uploadResponse) console.log('manifest id: ', uploadResponse.id)
    } catch (error) {
      console.log(error)
    }
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest()
    const credentials: CredentialsDto = req.body
    const { collectionId } = req.params
    return next
      .handle()
      .pipe(
        tap(() => this.handleUploadImagesArweave(collectionId, credentials)),
      )
  }
}
