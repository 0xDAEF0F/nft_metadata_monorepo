import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class OnlyIfDeployedGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const { collectionId } = context.switchToHttp().getRequest().params

    const collection = await this.prismaService.collection.findUnique({
      where: {
        id: +collectionId,
      },
      select: { contractAddress: true },
    })

    if (collection?.contractAddress) return true

    throw new BadRequestException('collection not deployed')
  }
}
