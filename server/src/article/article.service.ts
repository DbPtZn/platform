import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Article } from './article.entity'
import { Repository } from 'typeorm'
import { UserService } from 'src/user/user.service'
import { AllotArticleDto, ArticleFilter, CreateArticleDto, ParseArticleDto } from './dto'
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
    // private readonly userService: UserService
  ) {}

  /** 查询文章版本是否存在 */
  queryEditionExists(editionId: string) {
    return this.articlesRepository.existsBy({ editionId })
  }

  async create(dto: CreateArticleDto, userId: string, fromEditionId: string) {
    const { UID, isParsed, editorVersion, authcodeId, penname, email, blog, msg, type, title, abbrev, content, audio, duration, wordage } =
      dto
    try {
      const user = await this.usersRepository.findOneBy({ id: userId })
      if (!user) throw new Error('用户不存在！')
      const authcode = await this.authcodesRepository.findOneBy({ id: authcodeId })
      if (!user) throw new Error('授权不存在！')
      const article = new Article()
      article.user = user
      article.authcode = authcode
      const data = {
        isParsed,
        editionId: !fromEditionId ? UUID.v4() : null,
        fromEditionId: fromEditionId ? fromEditionId : null,
        editorVersion,
        // authcodeId,
        msg,
        type,
        title,
        abbrev,
        content,
        audio,
        penname,
        email,
        author: {
          blog
        },
        duration,
        wordage,
        detail: {
          fileSize: 0
        },
        userId,
        UID
      }
      const entity = Object.assign(article, data)
      return this.articlesRepository.save(entity)
    } catch (error) {
      throw error
    }
  }

  async parse(dto: ParseArticleDto, userId: string, UID: string) {
    try {
      const {
        id,
        cover,
        content,
        duration,
        promoterSequence,
        keyframeSequence,
        subtitleSequence,
        subtitleKeyframeSequence
      } = dto
      const article = await this.articlesRepository.findOneBy({id})
      if (!article) {
        throw new Error('文章不存在！')
      }
      // let filepath = ''
      // if (article.type === 'course' && article.audio) {
      //   // filepath = await this.fileService.saveAudio(
      //   //   {
      //   //     sourcePath: article.audio,
      //   //     extname: path.extname(article.audio),
      //   //     dirname: UID
      //   //   },
      //   //   userId
      //   // )
      //   // console.log(filepath)
      //   filepath = article.audio
      // }
      const text = content.replace(/<[^>]+>/g, '')
      article.isParsed = true
      article.cover = cover
      article.content = content
      // article.audio = filepath
      article.abbrev = text.slice(0, 100)
      article.duration = duration
      article.wordage = text.length
      article.detail = {
        fileSize: 0
      }
      article.promoterSequence = promoterSequence
      article.keyframeSequence = keyframeSequence
      article.subtitleSequence = subtitleSequence
      article.subtitleKeyframeSequence = subtitleKeyframeSequence
      console.log('解析成功')
      return this.articlesRepository.save(article)
    } catch (error) {
      throw error
    }
  }

  findOne(id: string, userId: string) {
    return this.articlesRepository.findOneBy({ id, userId })
  }

  async find(options: IPaginationOptions, filter: Partial<ArticleFilter>, userId: string) {
    // console.log(filter)
    try {
      const result = await paginate<Article>(this.articlesRepository, options, {
        where: { ...filter, userId },
        relations: ['authcode', 'album'],
        select: [
          'id',
          'UID',
          'editionId',
          'fromEditionId',
          'albumId',
          'isParsed',
          'title',
          'msg',
          'editorVersion',
          'type',
          'abbrev',
          'author',
          'createAt',
          'updateAt'
        ]
      })
      // console.log(result)
      return result
    } catch (error) {
      throw error
    }
  }

  async getUnparsedFile(id: string, userId: string) {
    try {
      const article = await this.articlesRepository.findOneBy({id, userId})
      if (article && !article.isParsed) {
        const filepath = article.content
        if (fs.existsSync(filepath)) {
          const file = fs.readFileSync(filepath)
          return file
        } else {
          throw new Error('目标文件不存在！')
        }
      } else {
        throw new Error('目标项目不存在！')
      }
    } catch (error) {
      throw error
    }
  }

  async allot(dto: AllotArticleDto, userId: string) {
    try {
      const { articleId, albumId } = dto
      const article = await this.articlesRepository.findOneBy({ id: articleId, userId })
      const album = await this.albumsRepository.findOneBy({ id: albumId })
      article.album = album 
      article.albumId = albumId
      await this.articlesRepository.save(article)
      return album
    } catch (error) {
      throw error
    }
  }

  async get(id: string) {
    try {
      const article = await this.articlesRepository.findOne({
        where: { id, removed: RemovedEnum.NEVER, isParsed: true },
        select: {
          editionId: false,
          fromEditionId: false,
          msg: false,
          removed: false
        },
        relations: ['user']
      })
      if (!article) throw new Error('文章不存在！')
      const common = this.configService.get<ReturnType<typeof commonConfig>>('common')
      article.avatar = article.avatar ? common.staticPrefix + article.avatar.split(common.publicDir.slice(1))[1] : ''
      return article
    } catch (error) {
      throw error
    }
  }

  async getAll(options: IPaginationOptions, filter: Partial<ArticleFilter>) {
    try {
      const result = await paginate<Article>(this.articlesRepository, options, {
        where: { ...filter },
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
      return result
    } catch (error) {
      throw error
    }
  }

  delete(id: string, userId: string) {
    return this.articlesRepository.delete({ id, userId })
  }

  async findAll(options: IPaginationOptions, filter: Partial<ArticleFilter>) {
    // console.log(filter)
    try {
      const result = await paginate<Article>(this.articlesRepository, options, {
        where: { ...filter },
        relations: ['authcode', 'album'],
        select: [
          'id',
          'UID',
          'editionId',
          'fromEditionId',
          'albumId',
          'isParsed',
          'title',
          'msg',
          'editorVersion',
          'type',
          'abbrev',
          'author',
          'createAt',
          'updateAt'
        ]
      })
      // console.log(result)
      return result
    } catch (error) {
      throw error
    }
  }
}
