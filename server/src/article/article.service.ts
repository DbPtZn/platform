import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Article } from './article.entity'
import { Repository } from 'typeorm'
import { UserService } from 'src/user/user.service'
import * as UUID from 'uuid'
import path from 'path'
import fs from 'fs'
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate'
import { UploadfileService } from 'src/uploadfile/uploadfile.service'
import { Album } from 'src/album/album.entity'
import { RemovedEnum } from 'src/enum'
import { ConfigService } from '@nestjs/config'
import { User } from 'src/user/user.entity'
import { Authcode } from 'src/authcode/authcode.entity'
import { commonConfig } from 'src/config'
import { ArticleFilter } from './dto/getList.dto'
import { GenerationService } from 'src/generation/generation.service'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Authcode)
    private authcodesRepository: Repository<Authcode>,
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    private readonly fileService: UploadfileService,
    private readonly configService: ConfigService,
    // private readonly generationService: GenerationService,
    // private readonly userService: UserService
  ) {}

  async findAll(options: IPaginationOptions, filter: Partial<ArticleFilter>) {
    // console.log(filter)
    try {
      const result = await paginate<Article>(this.articlesRepository, options, {
        where: { ...filter, isParsed: true, isPublished: true, isDisplayed: true },
        relations: ['album'],
        select: {
          id: true,
          albumId: true,
          cover: true,
          title: true,
          abbrev: true,
          penname: true,
          email: true,
          avatar: true,
          duration: true,
          wordage: true,
          detail: { fileSize: true },
          author: { blog: true },
          meta: { views: true, likes: true, collections: true, comments: true },
          tags: true,
          createAt: true,
          updateAt: true
        }
      })
      // console.log(result)
      return result
    } catch (error) {
      throw error
    }
  }

  async findOne(id: string) {
    try {
      const article = await this.articlesRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .select(['article', 'user.UID', 'user.nickname', 'user.avatar'])
      .where({ id: id })
      .getOne()
      // console.log(article.user)
      // console.log(article)
      article.unparsedFile = ''
      return article
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
