import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { User } from 'src/user/user.entity';
import { Article } from 'src/article/article.entity';
import { UploadfileModule } from 'src/uploadfile/uploadfile.module';

@Module({
  imports: [TypeOrmModule.forFeature([Album, User, Article]), UploadfileModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
