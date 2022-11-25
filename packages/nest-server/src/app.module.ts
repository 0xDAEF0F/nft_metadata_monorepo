import { Module } from '@nestjs/common'
import { CryptoService } from './crypto/crypto.service'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma.service'
import { APP_PIPE } from '@nestjs/core'
import { ZodValidationPipe } from 'nestjs-zod'
import { CollectionService } from './collection/collection.service'
import { CollectionController } from './collection/collection.controller'
import { AttributeController } from './attribute/attribute.controller'
import { AwsSdkModule } from 'aws-sdk-v3-nest'
import { S3Client } from '@aws-sdk/client-s3'
import { AppController } from './app.controller'
import { S3Service } from './s3/s3.service'

@Module({
  imports: [
    AwsSdkModule.register({
      client: new S3Client({
        region: 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET as string,
        },
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController, CollectionController, AttributeController],
  providers: [
    CryptoService,
    PrismaService,
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    CollectionService,
    S3Service,
  ],
})
export class AppModule {}
