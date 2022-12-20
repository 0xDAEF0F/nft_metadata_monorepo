import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UserOwnsCollection } from './user-owns-collection.guard'
import { PrismaService } from 'src/prisma.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CollectionDto, EditCollectionDto } from './collection-dto'
import { CollectionService } from './collection.service'
import { User } from './user.decorator'
import { DeleteCollectionImagesInterceptor } from './delete-collection-images.interceptor'
import { CollectionExistsGuard } from './collection-exists.guard'
import { QueryDto } from 'src/nft/nft-dto'
import { WhitelistService } from 'src/whitelist/whitelist.service'
import { CryptoService } from 'src/crypto/crypto.service'
import { AuthService } from 'src/auth/auth.service'
import { CredentialsDto } from 'src/auth/credentials-dto'
import { MetadataService } from 'src/metadata/metadata.service'
import { ConfigService } from '@nestjs/config'
import { CollectionAlreadyDeployedGuard } from './collection-already-deployed.guard'
import to from 'await-to-js'

@Controller('collection')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(
    private collectionService: CollectionService,
    private prismaService: PrismaService,
    private whitelistService: WhitelistService,
    private authService: AuthService,
    private cryptoService: CryptoService,
    private metadataService: MetadataService,
    private configService: ConfigService,
  ) {}

  @Get('getMany')
  getManyCollections(@User('id') userId, @Query() query: QueryDto) {
    return this.collectionService.getMany(userId, query)
  }

  @Get(':collectionId')
  @UseGuards(CollectionExistsGuard)
  getColletionData(@Param('collectionId', ParseIntPipe) collectionId: number) {
    return this.prismaService.collection.findUnique({
      where: { id: collectionId },
    })
  }

  @Post('create')
  createCollection(
    @User('id') id: number,
    @Body() createCollectionDto: CollectionDto,
  ) {
    return this.collectionService.createCollection(createCollectionDto, id)
  }

  @Put('edit/:collectionId')
  @UseGuards(UserOwnsCollection, CollectionAlreadyDeployedGuard)
  async editCollection(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Body() editCollectionDto: EditCollectionDto,
  ) {
    return this.collectionService.updateCollection(
      editCollectionDto,
      collectionId,
    )
  }

  @Delete('delete/:collectionId')
  @UseGuards(UserOwnsCollection, CollectionAlreadyDeployedGuard)
  @UseInterceptors(DeleteCollectionImagesInterceptor)
  async deleteCollection(
    @Param('collectionId', ParseIntPipe) collectionId: number,
  ) {
    const deleteNfts = this.prismaService.nft.deleteMany({
      where: { collectionId },
    })
    const deleteCollection = this.prismaService.collection.delete({
      where: { id: collectionId },
    })

    const [err] = await to(
      this.prismaService.$transaction([deleteNfts, deleteCollection]),
    )
    if (err) throw new InternalServerErrorException()

    return { collectionId: collectionId, success: true }
  }

  @Post('deploy/:collectionId')
  @UseGuards(UserOwnsCollection, CollectionAlreadyDeployedGuard)
  async deployCollection(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Body() credentialsDto: CredentialsDto,
  ) {
    const {
      inviteList,
      Nft: nfts,
      name: collectionName,
      _count,
    } = await this.prismaService.collection.findUniqueOrThrow({
      where: { id: collectionId },
      select: {
        inviteList: true,
        Nft: true,
        name: true,
        _count: true,
      },
    })
    if (inviteList.length === 0)
      throw new BadRequestException('No whitelist addresses in collection')

    if (_count.Nft === 0)
      throw new BadRequestException('zero nfts in collection')

    if (!this.metadataService.isCollectionMetadataComplete(nfts))
      throw new BadRequestException('one or more nfts with incomplete metadata')

    const merkleRoot = this.whitelistService.computeRoot(inviteList)
    const { privateKey } = await this.authService.ejectUser(credentialsDto)

    const { contractAddress } = await this.cryptoService.createERC721Contract(
      privateKey,
      {
        merkleRoot,
        collectionName,
        collectionTicker: collectionName.slice(0, 3).toUpperCase(),
        maxSupply: _count.Nft,
        baseUrl:
          this.configService.getOrThrow<string>('API_BASE_URL') +
          'metadata/' +
          collectionId +
          '/',
      },
    )

    await this.prismaService.collection.update({
      where: { id: collectionId },
      data: { contractAddress },
    })

    return { contractAddress }
  }
}
