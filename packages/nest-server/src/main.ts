import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { CryptoService } from './crypto/crypto.service'
import { PrismaService } from './prisma.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const prismaService = app.get(PrismaService)
  const cryptoService = app.get(CryptoService)
  await prismaService.enableShutdownHooks(app)
  await app.listen(3000)

  // Fund users wallets
  if (process.env.PRODUCTION === 'false') {
    cryptoService.fundUsersWallet()
  }
}
bootstrap()
