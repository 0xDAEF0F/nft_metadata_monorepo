import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { CryptoService } from './crypto/crypto.service'
import { PrismaService } from './prisma.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  const prismaService = app.get(PrismaService)
  const cryptoService = app.get(CryptoService)
  const configService = app.get(ConfigService)

  await prismaService.enableShutdownHooks(app)
  await app.listen(3000)

  // Fund users wallets
  if (configService.get<string>('NODE_ENV') === 'development') {
    cryptoService.fundUsersWallet()
  }
}
bootstrap()
