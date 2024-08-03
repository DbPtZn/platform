import { Module } from '@nestjs/common'
import { UploadfileService } from './uploadfile.service'
import { UploadfileController } from './uploadfile.controller'
import { UploadFile } from './uploadfile.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MulterModule } from '@nestjs/platform-express'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import { diskStorage } from 'multer'

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
               // 使用 file.originalname 的时候，如果上传多张图片，必须确保图片名称不一样，否则后面的图片会覆盖前面的
              cb(null, file.originalname)
            }
          })
        }
      }
    }),
  ],
  controllers: [UploadfileController],
  providers: [UploadfileService],
  exports: [UploadfileService]
})
export class UploadfileModule {}
