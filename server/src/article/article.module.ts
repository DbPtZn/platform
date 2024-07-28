import { Module } from '@nestjs/common'
import { ArticleService } from './article.service'
import { ArticleController } from './article.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from './article.entity'
import { UserModule } from 'src/user/user.module'
import { UploadfileModule } from 'src/uploadfile/uploadfile.module'
import { Column } from 'src/column/column.entity'
import { ConfigModule } from '@nestjs/config'
import { User } from 'src/user/user.entity'
import { Authcode } from 'src/authcode/authcode.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Authcode, Column]), UserModule, ConfigModule, UploadfileModule],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService]
})
export class ArticleModule {}
