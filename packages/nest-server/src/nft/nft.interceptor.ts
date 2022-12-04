import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import to from 'await-to-js'
import { Observable, tap } from 'rxjs'
import { NftService } from './nft.service'
import { NftImagePayload } from './types'

@Injectable()
export class NftInterceptor implements NestInterceptor {
  constructor(private nftService: NftService) {}

  async uploadFiles(files: Express.Multer.File[], collectionId: number) {
    for (let i = 0; i < files.length; i++) {
      const asset: NftImagePayload = {
        collectionId: collectionId,
        data: files[i].buffer,
        imageName: files[i].originalname,
        tokenId: +files[i].originalname.split('.')[0],
      }
      const [err] = await to(this.nftService.createOrUpdateNftImage(asset))
      if (err)
        console.log(`error uploading image ${asset.imageName}:`, err.message)
    }
    console.log(`done processing files for collection: ${collectionId}`)
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const files: Express.Multer.File[] = req.files
    const { collectionId } = req.params

    return next.handle().pipe(tap(() => this.uploadFiles(files, +collectionId)))
  }
}
