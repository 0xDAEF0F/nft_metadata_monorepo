import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UserOwnsCollection } from 'src/collection/user-owns-collection.guard'
import { OnlyIfDeployedGuard } from './only-if-deployed.guard'
import { FundedBundlrNodeGuard } from './funded-bundlr-node.guard'
import { UploadImagesArweaveInterceptor } from './upload-images-arweave.interceptor'
import { LocalAuthGuard } from 'src/auth/local-auth.guard'
import { CollectionExistsGuard } from 'src/collection/collection-exists.guard'
import { ArweaveService } from './arweave.service'
import { BundlrService } from './bundlr.service'
import { BigNumber } from 'bignumber.js'

@Controller('arweave')
export class ArweaveController {
  constructor(
    private arweaveService: ArweaveService,
    private bundlrService: BundlrService,
  ) {}

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

  @Get('balance')
  async test() {
    const nativeBalance = new BigNumber(
      await this.arweaveService.wallets.getBalance(this.bundlrService.address),
    )
    const loadedBalance = await this.bundlrService.getLoadedBalance()

    console.log(this.bundlrService.address)

    // const fund = await this.bundlrService.fund(nativeBalance.times(0.9))
    // return { fund }
    return { nativeBalance, loadedBalance }
  }
}
