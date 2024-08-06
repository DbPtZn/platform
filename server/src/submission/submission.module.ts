import { Module } from '@nestjs/common'
import { SubmissionService } from './submission.service'
import { SubmissionController } from './submission.controller'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Album } from 'src/album/album.entity'
import { Article } from 'src/article/article.entity'
import { Authcode } from 'src/authcode/authcode.entity'
import { UploadfileModule } from 'src/uploadfile/uploadfile.module'
import { User } from 'src/user/user.entity'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Authcode, Album]), UserModule, ConfigModule, UploadfileModule],
  controllers: [SubmissionController],
  providers: [SubmissionService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
