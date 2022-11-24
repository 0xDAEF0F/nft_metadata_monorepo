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
import { UserOwnsCollection } from './user-owns-collection.guard'

@Controller('attribute')
@UseGuards(JwtAuthGuard)
export class AttributeController {
  constructor(private prismaService: PrismaService) {}

  @Post('create/:collectionId')
  @UseGuards(UserOwnsCollection)
  create(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Body() createAttributeDto: CreateAttributeDto,
  ) {
    return this.prismaService.attribute.create({
      data: { ...createAttributeDto, collectionId },
    })
  }
}
