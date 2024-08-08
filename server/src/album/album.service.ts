import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Article } from 'src/article/article.entity'
import { User } from 'src/user/user.entity'
import { Repository, DataSource } from 'typeorm'
import { Album } from './album.entity'
import { CreateAlbumDto } from './dto/create-album.dto'
import { RemovedEnum } from 'src/enum'

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    private readonly dataSource: DataSource
  ) {}

  async create(dto: CreateAlbumDto, userId: string, UID: string) {
    try {
      const { name, cover, desc } = dto
      const album = new Album()
      album.UID = UID
      album.userId = userId
      album.name = name
      album.cover = cover
      album.desc = desc

      const user = await this.usersRepository.findOneBy({ id: userId })

      // 使用事务来确保所有操作要么全部成功，要么全部撤销
      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()
      let newalbum: Album
      try {
        newalbum = await queryRunner.manager.save(album)
        if (user.albumSequence) {
          user.albumSequence.push(newalbum.id)
        } else {
          user.albumSequence = [newalbum.id]
        }
        await queryRunner.manager.save(user)
        await queryRunner.commitTransaction()
      } catch (error) {
        await queryRunner.rollbackTransaction()
        console.log(error)
        throw error
      } finally {
        await queryRunner.release()
      }

      return newalbum
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async getAlbums(userId: string) {
    try {
      const albums = await this.albumsRepository.findBy({ userId, removed: RemovedEnum.NEVER })
      return albums
    } catch (error) {
      throw error
    }
  }

  async getAlbum(albumId: string, userId: string) {
    try {
      const articles = await this.articlesRepository.find({
        where: { albumId, userId, removed: RemovedEnum.NEVER },
        select: [
          'id',
          'albumId',
          'editionId',
          'type',
          'title',
          'abbrev',
          'cover',
          'isParsed',
          'isPublished',
          'isDisplayed',
          'author',
          'detail'
        ]
      })
      const album = await this.albumsRepository.findOneBy({ id: albumId, removed: RemovedEnum.NEVER })
      if (!album) {
        throw new Error('专栏不存在')
      }
      const data = {
        id: album.id,
        name: album.name,
        isDisplayed: album.isDisplayed,
        subfiles: articles.map(article => {
          return {
            id: article.id,
            albumId: article.albumId,
            editionId: article.editionId,
            type: article.type,
            title: article.title,
            abbrev: article.abbrev,
            cover: article.cover,
            isParsed: article.isParsed,
            isPublished: article.isPublished,
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
