import { Module } from '@nestjs/common'
import { UploadfileService } from './uploadfile.service'
import { UploadfileController } from './uploadfile.controller'
import { UploadFile } from './uploadfile.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([UploadFile])],
  controllers: [UploadfileController],
  providers: [UploadfileService],
  exports: [UploadfileService]
})
export class UploadfileModule {}
