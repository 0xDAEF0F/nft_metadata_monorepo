import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class NftExistsGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const { collectionId, tokenId } = context.switchToHttp().getRequest().params

    const nft = await this.prismaService.nft.findUnique({
      where: {
        collectionId_tokenId: {
          collectionId: +collectionId,
          tokenId: +tokenId,
        },
      },
      select: { tokenId: true },
    })

    if (!nft) throw new BadRequestException('nft does not exist')

    return true
  }
}
