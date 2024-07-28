import { Injectable } from '@nestjs/common'
import { CreateColumnDto } from './dto/create-column.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Column } from './column.entity'
import { User } from 'src/user/user.entity'
import { RemovedEnum } from 'src/enum'
import { Article } from 'src/article/article.entity'

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(Column)
    private columnsRepository: Repository<Column>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    private readonly dataSource: DataSource
  ) {}

  async create(dto: CreateColumnDto, userId: string, UID: string) {
    try {
      const { name, cover, desc } = dto
      const column = new Column()
      column.id = 
      column.UID = UID
      column.userId = userId
      column.name = name
      column.cover = cover
      column.desc = desc

      const user = await this.usersRepository.findOneBy({ id: userId })

      // 使用事务来确保所有操作要么全部成功，要么全部撤销
      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()
      let newColumn: Column
      try {
        newColumn = await queryRunner.manager.save(column)
        user.columnSequence.unshift(newColumn.id)
        await queryRunner.manager.save(user)
        await queryRunner.commitTransaction()
      } catch (error) {
        await queryRunner.rollbackTransaction()
        throw error
      } finally {
        await queryRunner.release()
      }

      return newColumn
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async getColumns(userId: string) {
    try {
      const columns = await this.columnsRepository.findOneBy({ userId, removed: RemovedEnum.NEVER })
      return columns
    } catch (error) {
      throw error
    }
  }

  async getColumn(columnId: string, userId: string) {
    try {
      const articles = await this.articlesRepository.find({
        where: { columnId, userId, removed: RemovedEnum.NEVER },
        select: [
          'id',
          'columnId',
          'editionId',
          'type',
          'title',
          'abbrev',
          'cover',
          'isParsed',
          'isPublish',
          'author',
          'detail'
        ]
      })
      const column = await this.columnsRepository.findOneBy({ id: columnId, removed: RemovedEnum.NEVER })
      if (!column) {
        throw new Error('专栏不存在')
      }
      const data = {
        id: column.id,
        name: column.name,
        isPublish: column.isPublish,
        subfiles: articles.map(article => {
          return {
            id: article.id,
            columnId: article.columnId,
            editionId: article.editionId,
            type: article.type,
            title: article.title,
            abbrev: article.abbrev,
            cover: article.cover,
            isParsed: article.isParsed,
            isPublish: article.isPublish,
            author: article.author,
            detail: article.detail
          }
        })
      }
      return data
    } catch (error) {
      throw error
    }
  }

  update() {
    // 更新名称、封面、发布状态
  }

  remove() {
    // 移除
  }
}
