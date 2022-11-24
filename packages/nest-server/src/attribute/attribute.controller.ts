import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PrismaService } from 'src/prisma.service'
import { CreateAttributeDto } from './attribute-dto'
import { UserOwnsResource } from './user-owns-resource.guard'

@Controller('attribute')
@UseGuards(JwtAuthGuard)
export class AttributeController {
  constructor(private prismaService: PrismaService) {}

  @Post(':collectionId/create')
  @UseGuards(UserOwnsResource)
  create(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Body() createAttributeDto: CreateAttributeDto,
  ) {
    return this.prismaService.attribute.create({
      data: { ...createAttributeDto, collectionId },
    })
  }
}
