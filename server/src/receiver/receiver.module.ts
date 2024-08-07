import { Module } from '@nestjs/common'
import { ReceiverService } from './receiver.service'
import { ReceiverController } from './receiver.controller'
import { UserModule } from 'src/user/user.module'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { AuthcodeModule } from 'src/authcode/authcode.module'
import * as randomstring from 'randomstring'
import { ArticleModule } from 'src/article/article.module'
import { UploadfileModule } from 'src/uploadfile/uploadfile.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/user.entity'
import { SubmissionModule } from 'src/submission/submission.module'
const __rootdirname = process.cwd()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.registerAsync({
      imports: [ConfigModule], // 导入 ConfigModule，以便在 TypeOrmModule 中使用 ConfigService
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const common = configService.get<ReturnType<typeof commonConfig>>('common')
        // const dest = common.appDir && common.tempDir ? join(common.appDir, common.tempDir) : join(__rootdirname, 'temp')
        return {
          storage: diskStorage({
            destination: common.fullTempDir,
            filename: (_, file, cb) => {
              // console.log(_.files)
              // console.log(_.fields)
              // console.log(_.body)
              // console.log(_.baseUrl)
              // // console.log(_.ip)
              // console.log(extname(file.mimetype))
              // console.log('storage')
              // console.log(file)
              const filename = `${randomstring.generate(3)}${new Date().getTime()}${extname(file.originalname)}`
              cb(null, filename)
            }
          })
        }
      }
    }),
    ArticleModule,
    SubmissionModule,
    UploadfileModule,
    AuthcodeModule
  ],
  controllers: [ReceiverController],
  providers: [ReceiverService]
})
export class ReceiverModule {}
