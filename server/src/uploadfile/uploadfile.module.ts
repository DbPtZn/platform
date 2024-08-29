import { Module } from '@nestjs/common'
import { UploadfileService } from './uploadfile.service'
import { UploadfileController } from './uploadfile.controller'
import { UploadFile } from './uploadfile.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MulterModule } from '@nestjs/platform-express'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import { diskStorage } from 'multer'
import { extname } from 'path'
import randomstring from 'randomstring'
import { BucketModule } from 'src/bucket/bucket.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadFile]),
    MulterModule.registerAsync({
      imports: [ConfigModule], // 导入 ConfigModule，以便在 TypeOrmModule 中使用 ConfigService
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const common = configService.get<ReturnType<typeof commonConfig>>('common')
        const dest = common.fullTempDir
        return {
          storage: diskStorage({
            destination: dest,
            filename: (_, file, cb) => {
              const filename = `${randomstring.generate(5)}-${new Date().getTime()}${extname(file.originalname)}`
              cb(null, filename)
            }
          })
        }
      }
    }),
    BucketModule
  ],
  controllers: [UploadfileController],
  providers: [UploadfileService],
  exports: [UploadfileService]
})
export class UploadfileModule {}
