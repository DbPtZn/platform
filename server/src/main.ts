import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import path from 'path'
import dotenv from 'dotenv'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
async function bootstrap() {
  dotenv.config({
    path:
      process.env.NODE_ENV === 'development'
        ? ['.env.development.local', '.env.development']
        : ['.env.production.local', '.env.production']
  })

  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Content-Range,X-Content-Range',
    credentials: true
    // maxAge: 3600 * 24
  })

  const configService = app.get(ConfigService)
  const __rootdirname = process.cwd()
  const appDir = configService.get('common.appDir')
  const userDir = configService.get('common.userDir')
  const publicDir = configService.get('common.publicDir')
  const staticPrefix = configService.get('common.staticPrefix')
  // console.log(path.join(__rootdirname, userDir, publicDir), staticPrefix)
  app.useStaticAssets(path.join(appDir ? appDir : __rootdirname, userDir, publicDir), { prefix: staticPrefix })

  /** 数据验证错误的响应 */
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(3000)
}
bootstrap()
