import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { UtilService } from 'src/util/util.service'

@Injectable()
export class AssetFilesGuard implements CanActivate {
  constructor(private utilService: UtilService) {}

  canActivate(context: ExecutionContext) {
    const files: Express.Multer.File[] = context
      .switchToHttp()
      .getRequest().files

    if (!files || files.length === 0)
      throw new BadRequestException('no images to process')

    const requestAssetIds = files.map((a) => a.originalname.split('.')[0])
    if (!this.utilService.isArrayInSequence(requestAssetIds))
      throw new BadRequestException('images are not in sequence')

    return true
  }
}
