import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class CollectionAlreadyDeployedGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const { collectionId } = context.switchToHttp().getRequest().params

    const collection = await this.prismaService.collection.findUnique({
      where: {
        id: +collectionId,
      },
      select: { deployed: true },
    })

    if (!collection || collection.deployed)
      throw new BadRequestException('collection already deployed')

    return true
  }
}
