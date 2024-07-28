import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Article } from './article.entity'
import { Repository } from 'typeorm'
import { UserService } from 'src/user/user.service'
import { ArticleFilter, CreateArticleDto, ParseArticleDto } from './dto'
import UUID from 'uuid'
import path from 'path'
import fs from 'fs'
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate'
import { UploadfileService } from 'src/uploadfile/uploadfile.service'
import { Column } from 'src/column/column.entity'
import { RemovedEnum } from 'src/enum'
import { ConfigService } from '@nestjs/config'
import { User } from 'src/user/user.entity'
import { Authcode } from 'src/authcode/authcode.entity'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Authcode)
    private authcodesRepository: Repository<Authcode>,
    @InjectRepository(Column)
    private columnsRepository: Repository<Column>,
    private readonly fileService: UploadfileService,
    private readonly configService: ConfigService,
    // private readonly userService: UserService
  ) {}

  /** 查询文章版本是否存在 */
  queryEditionExists(editionId: string) {
    return this.articlesRepository.existsBy({ editionId })
  }

  async create(dto: CreateArticleDto, userId: string, fromEditionId: string) {
    const { UID, isParsed, editorVersion, authcodeId, penname, email, blog, msg, type, title, abbrev, content, audio } =
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
        authcodeId,
        msg,
        type,
        title,
        abbrev,
        content,
        audio,
        penname,
        email,
        author: {
          penname,
          email,
          blog
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
      let filepath = ''
      if (article.type === 'course' && article.audio) {
        filepath = await this.fileService.saveAudio(
          {
            sourcePath: article.audio,
            extname: path.extname(article.audio),
            dirname: UID
          },
          userId
        )
        // console.log(filepath)
      }
      const text = content.replace(/<[^>]+>/g, '')
      article.isParsed = true
      article.cover = cover
      article.content = content
      article.audio = filepath
      article.abbrev = text.slice(0, 100)
      article.detail = {
        duration: duration,
        wordage: text.length,
        fileSize: 0
      }
      article.promoterSequence = promoterSequence
      article.keyframeSequence = keyframeSequence
      article.subtitleSequence = subtitleSequence
      article.subtitleKeyframeSequence = subtitleKeyframeSequence

      return this.articlesRepository.save(article)
    } catch (error) {
      throw error
    }
  }

  findOne(id: string, userId: string) {
    return this.articlesRepository.findOneBy({ id, userId })
  }

  async find(options: IPaginationOptions, filter: ArticleFilter, userId: string) {
    // console.log(filter)
    try {
      const result = await paginate<Article>(this.articlesRepository, options, {
        where: { ...filter, userId },
        relations: ['authcode', 'column'],
        select: [
          'id',
          'UID',
          'editionId',
          'fromEditionId',
          'authcodeId',
          'columnId',
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
      return result
    } catch (error) {
      throw error
    }
  }

  async getUnparsedFile(id: string) {
    try {
      const article = await this.articlesRepository.findOneBy({id})
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

  async allot(id: string, columnId: string, userId: string) {
    try {
      const article = await this.articlesRepository.findOneBy({ id, userId })
      const column = await this.columnsRepository.findOneBy({ id: columnId })
      article.column = column 
      article.columnId = columnId
      const result = await this.articlesRepository.save(article)
      return result
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
      const prefix = this.configService.get('common.staticPrefix')
      article.author.avatar = article.author.avatar ? prefix + article.author.avatar.split(prefix)[1] : ''
      return article
    } catch (error) {
      throw error
    }
  }

  async getAll(options: IPaginationOptions, filter: ArticleFilter) {
    try {
      const result = await paginate<Article>(this.articlesRepository, options, {
        where: { ...filter },
        relations: ['column'],
        select: {
          id: true,
          columnId: true,
          cover: true,
          title: true,
          abbrev: true,
          detail: { wordage: true, duration: true, fileSize: true },
          author: { penname: true, avatar: true, email: true, blog: true },
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
}
