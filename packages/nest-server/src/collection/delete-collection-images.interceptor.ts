import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import to from 'await-to-js'
import { Observable, tap } from 'rxjs'
import { S3Service } from 'src/s3/s3.service'

@Injectable()
export class DeleteCollectionImagesInterceptor implements NestInterceptor {
  constructor(private s3Service: S3Service) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(
        async ({
          collectionId,
          success,
        }: {
          collectionId: number
          success: boolean
        }) => {
          if (success) {
            const [err] = await to(
              this.s3Service.deleteObjectsFromPrefix(`${collectionId}/`),
            )
            if (err) {
              console.log(
                'Could not delete images from collection id: ',
                collectionId,
              )
            } else {
              console.log('deleted images from collection: ', collectionId)
            }
          }
        },
      ),
    )
  }
}
