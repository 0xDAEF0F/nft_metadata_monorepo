import { Module } from '@nestjs/common'
import { CryptoService } from './crypto/crypto.service'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma.service'
import { APP_PIPE } from '@nestjs/core'
import { ZodValidationPipe } from 'nestjs-zod'
import { CollectionService } from './collection/collection.service';
import { CollectionController } from './collection/collection.controller';

@Module({
  imports: [AuthModule],
  controllers: [CollectionController],
  providers: [
    CryptoService,
    PrismaService,
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    CollectionService,
  ],
})
export class AppModule {}
