import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CredentialsDto } from './credentials-dto'

@Injectable()
export class IsUserAvailablePipe implements PipeTransform {
  constructor(private prismaService: PrismaService) {}

  async transform(value: CredentialsDto) {
    const { username } = value

    const user = await this.prismaService.user.findUnique({
      where: { username },
      select: { id: true },
    })

    if (user) throw new BadRequestException('Username already exists')

    return value
  }
}
