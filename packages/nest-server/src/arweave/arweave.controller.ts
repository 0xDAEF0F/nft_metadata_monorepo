import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common'
import { UserOwnsCollection } from 'src/collection/user-owns-collection.guard'
import { OnlyIfDeployedGuard } from './only-if-deployed.guard'
import { FundedBundlrNodeGuard } from './funded-bundlr-node.guard'
import { UploadImagesArweaveInterceptor } from './upload-images-arweave.interceptor'
import { LocalAuthGuard } from 'src/auth/local-auth.guard'
import { CollectionExistsGuard } from 'src/collection/collection-exists.guard'

@Controller('arweave')
export class ArweaveController {
  @Post('deploy/:collectionId')
  @UseGuards(
    LocalAuthGuard,
    CollectionExistsGuard,
    UserOwnsCollection,
    OnlyIfDeployedGuard,
    FundedBundlrNodeGuard,
  )
  @UseInterceptors(UploadImagesArweaveInterceptor)
  deployToArweave() {
    return { data: 'deploying to arweave' }
  }
}
