import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { keccak256 } from 'ethers/lib/utils'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CollectionAlreadyDeployedGuard } from 'src/collection/collection-already-deployed.guard'
import { CollectionExistsGuard } from 'src/collection/collection-exists.guard'
import { UserOwnsCollection } from 'src/collection/user-owns-collection.guard'
import { PrismaService } from 'src/prisma.service'
import { WhiteListDto } from './address-dto'
import { MerkleQueryDto } from './merkleParams-dto'
import { WhitelistService } from './whitelist.service'

@Controller('whitelist')
@UseGuards(JwtAuthGuard)
export class WhitelistController {
  constructor(
    private prismaService: PrismaService,
    private whiteListService: WhitelistService,
  ) {}

  @Post('invite/:collectionId')
  @UseGuards(
    CollectionExistsGuard,
    UserOwnsCollection,
    CollectionAlreadyDeployedGuard,
  )
  inviteAddress(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Body() body: WhiteListDto,
  ) {
    return this.prismaService.collection.update({
      where: { id: collectionId },
      data: {
        inviteList: body.inviteList,
      },
      select: { inviteList: true },
    })
  }

  @Get('getMerkleProof/:collectionId')
  @UseGuards(CollectionExistsGuard)
  async getMerkleParams(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Query() { address }: MerkleQueryDto,
  ) {
    const { deployed, inviteList } =
      await this.prismaService.collection.findUniqueOrThrow({
        where: { id: collectionId },
        select: { deployed: true, inviteList: true },
      })
    if (!deployed) throw new BadRequestException('collection not yet deployed')

    if (inviteList.length === 0) throw new BadRequestException('no invite list')

    if (!this.whiteListService.isAddressPartOfInviteList(inviteList, address))
      throw new BadRequestException('address is not in whitelist.')

    const tree = this.whiteListService.constructMerkeTree(inviteList)
    const proof = this.whiteListService.getProof(inviteList, address)
    const root = this.whiteListService.computeRoot(inviteList)

    console.log('isleaf: ', tree.verify(proof, keccak256(address), root))

    return { proof, root }
  }
}
