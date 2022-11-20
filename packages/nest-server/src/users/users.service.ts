import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findOne(username: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { username } })
  }
}
