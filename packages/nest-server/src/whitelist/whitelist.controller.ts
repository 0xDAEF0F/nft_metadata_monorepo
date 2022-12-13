import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CollectionExistsGuard } from 'src/collection/collection-exists.guard'
import { UserOwnsCollection } from 'src/collection/user-owns-collection.guard'
import { PrismaService } from 'src/prisma.service'
import { WhiteListDto } from './address-dto'

@Controller('whitelist')
@UseGuards(JwtAuthGuard)
export class WhitelistController {
  constructor(private prismaService: PrismaService) {}

  @Post('invite/:collectionId')
  @UseGuards(CollectionExistsGuard, UserOwnsCollection)
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
}
