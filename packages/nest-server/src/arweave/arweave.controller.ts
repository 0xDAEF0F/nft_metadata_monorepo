import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UserOwnsCollection } from 'src/collection/user-owns-collection.guard'
import { OnlyIfDeployedGuard } from './only-if-deployed.guard'
import { FundedBundlrNodeGuard } from './funded-bundlr-node.guard'
import { UploadImagesArweaveInterceptor } from './upload-images-arweave.interceptor'
import { LocalAuthGuard } from 'src/auth/local-auth.guard'
import { S3Service } from 'src/s3/s3.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CollectionExistsGuard } from 'src/collection/collection-exists.guard'
import { ArweaveService } from './arweave.service'
import { EnoughArToFundBundlrGuard } from './enough-ar-to-fund-bundlr.guard'
import { CredentialsDto } from 'src/auth/credentials-dto'
import { AuthService } from 'src/auth/auth.service'
import { BundlrService } from './bundlr.service'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'

@Controller('arweave')
export class ArweaveController {
  constructor(
    private s3Service: S3Service,
    private arweaveService: ArweaveService,
    private authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  async getArweaveBalance(@Req() req) {
    const { id }: User = req.user
    const { arweaveAddress } = await this.prismaService.user.findUniqueOrThrow({
      where: { id },
    })
    const arweaveBalance = await this.arweaveService.getArBalanceFromAddress(
      arweaveAddress,
    )

    const bundlr = new BundlrService()

    const bundlrBalance = await bundlr.getBalance(arweaveAddress)

    return {
      arweaveNative: arweaveBalance,
      arweaveBundlr: bundlrBalance.toString(),
    }
  }

  @Post('fund-bundlr/:collectionId')
  @UseGuards(
    LocalAuthGuard,
    UserOwnsCollection,
    OnlyIfDeployedGuard,
    EnoughArToFundBundlrGuard,
  )
  async fundBundlr(
    @Body() credentials: CredentialsDto,
    @Param('collectionId', ParseIntPipe) collectionId: number,
  ) {
    const { arweavePrivateKey } = await this.authService.ejectUser(credentials)
    const bundlr = new BundlrService(arweavePrivateKey)
    const bytesInCollection =
      await this.s3Service.calculatesBytesSizeFromPrefix(`${collectionId}/`)
    const priceOfCollection = await bundlr.getPrice(bytesInCollection)

    // supply 3% extra to have extra cushion
    const { id } = await bundlr.fund(
      priceOfCollection.times(1.03).integerValue(),
    )

    return {
      transactionId: id,
    }
  }

  @Post('deploy/:collectionId')
  @UseGuards(
    LocalAuthGuard,
    UserOwnsCollection,
    OnlyIfDeployedGuard,
    FundedBundlrNodeGuard,
  )
  @UseInterceptors(UploadImagesArweaveInterceptor)
  deployToArweave() {
    return { data: 'deploying to arweave' }
  }

  @UseGuards(JwtAuthGuard, CollectionExistsGuard)
  @Get('estimate/:collectionId')
  async estimateDeployToArweavePriceInWinston(
    @Param('collectionId', ParseIntPipe) collectionId: number,
  ) {
    const bytesSize = await this.s3Service.calculatesBytesSizeFromPrefix(
      `${collectionId}/`,
    )
    const priceToDeploy = await new BundlrService().getPrice(bytesSize)
    return {
      winston: priceToDeploy.toString(),
    }
  }
}
