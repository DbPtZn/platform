import { Module } from '@nestjs/common'
import { ColumnService } from './column.service'
import { ColumnController } from './column.controller'
import { Column } from './column.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/user.entity'
import { Article } from 'src/article/article.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Column, User, Article])],
  controllers: [ColumnController],
  providers: [ColumnService],
  exports: [ColumnService]
})
export class ColumnModule {}
