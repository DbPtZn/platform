import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Album } from 'src/album/album.entity'
import { Article } from 'src/article/article.entity'
import { Authcode } from 'src/authcode/authcode.entity'
import { UploadfileService } from 'src/uploadfile/uploadfile.service'
import { AllotArticleDto, ArticleFilter, CreateArticleDto, ParseArticleDto } from './dto'
import { User } from 'src/user/user.entity'
import { DataSource, Repository } from 'typeorm'
import fsx from 'fs-extra'
import fs from 'fs'
import { RemovedEnum } from 'src/enum'
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate'
import { commonConfig } from 'src/config'
import * as UUID from 'uuid'
import { FfmpegService } from 'src/ffmpeg/ffmpeg.service'
import { basename, extname } from 'path'
@Injectable()
export class SubmissionService {
  private readonly common: ReturnType<typeof commonConfig>
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Authcode)
    private authcodesRepository: Repository<Authcode>,
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    private readonly ffmpegService: FfmpegService,
    private readonly fileService: UploadfileService,
    private readonly configService: ConfigService,
    // private readonly generationService: GenerationService,
    private readonly dataSource: DataSource,
    // private readonly userService: UserService
  ) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
  }

  /** 查询文章版本是否存在 */
  queryEditionExists(editionId: string) {
    return this.articlesRepository.existsBy({ editionId })
  }

  async create(dto: CreateArticleDto, userId: string) {
    const {
      UID,
      isParsed,
      unparsedFile,
      editorVersion,
      authcodeId,
      penname,
      email,
      blog,
      msg,
      type,
      title,
      abbrev,
      content,
      audio,
      duration,
      wordage
    } = dto
    try {
      const user = await this.usersRepository.findOneBy({ id: userId })
      if (!user) throw new Error('用户不存在！')

      const authcode = await this.authcodesRepository.findOneBy({ id: authcodeId })
      if (!authcode) throw new Error('授权不存在！')

      // 版本管理
      let editionId = dto.editionId
      // console.log('editionId:', editionId)
      let isMultiEdition = false
      let isCurrent = false
      if(editionId) {
        const editionCount = await this.articlesRepository.countBy({ editionId, userId })
        // console.log('editionCount:', editionCount)
        // 多个版本
        if(editionCount > 0) {
          isMultiEdition = true
        }
        // 无多版本
        if(editionCount === 0) {
          editionId = UUID.v4()
          isCurrent = true
        }
      } else {
        // 非新版本投稿
        editionId = UUID.v4()
        isCurrent = true
      }

      const article = new Article()
      article.userId = user.id
      article.UID = user.UID
      article.agentId = UUID.v4()
      article.editionId = editionId

      article.authcode = authcode
      article.user = user

      article.isParsed = isParsed
      article.isPublished = false
      article.isDisplayed = user.config?.autoDisplay || true // 根据用户设置（默认展示）
      article.isCurrent = isCurrent
      article.isMultiEdition = isMultiEdition

      article.editorVersion = editorVersion
      article.msg = msg
      article.type = type
      article.title = title
      article.abbrev = abbrev
      article.content = content
      article.unparsedFile = unparsedFile
      article.audio = audio
      article.penname = penname
      article.email = email
      article.author = {
        blog
      }
      article.duration = duration
      article.wordage = wordage
      article.detail = {
        fileSize: 0
      }

      return this.articlesRepository.save(article)
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
      console.log(dto)
      const article = await this.articlesRepository.findOneBy({ id })
      if (!article) {
        throw new Error('文章不存在！')
      }

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

      // 适配浏览器 保持一份 mp3 格式的音频
      try {
        const mp3path = this.fileService.createTempFilePath('.mp3', article.audio)
        // console.log('article.audio:', article.audio)
        // console.log(this.fileService.getFilePath(article.audio, article.UID))
        const tempAudioPath = this.fileService.createTempFilePath(extname(article.audio))
        await this.fileService.fetchRemoteFile(article.audio, article.UID, tempAudioPath)
        await this.ffmpegService.convertToMp3(tempAudioPath, mp3path)
        fs.unlinkSync(tempAudioPath)
        await this.fileService.upload({
          filename: basename(mp3path),
          path: mp3path,
          mimetype: 'audio/mp3'
        }, article.userId, article.UID, article.id)
      } catch (error) {
        throw new Error(`音频文件转换失败: ${error.message}`)
      }
      // const mp3duration = await this.ffmpegService.calculateDuration(mp3path)
      // console.log(`ogg音频时长：${duration}s，mp3音频时长：${mp3duration}s`)

      console.log('解析成功')
      
      // 使用事务来确保所有操作要么全部成功，要么全部撤销
      //  const queryRunner = this.dataSource.createQueryRunner()
      //  await queryRunner.connect()
      //  await queryRunner.startTransaction()
      //  try {
      //    await queryRunner.manager.save(article)
      //   //  const generation = await this.generationService.generateData(article)
      //   //  await queryRunner.manager.save(generation)
      //    await queryRunner.commitTransaction()
      //  } catch (error) {
      //    await queryRunner.rollbackTransaction()
      //    throw error
      //  } finally {
      //    await queryRunner.release()
      //  }

      return this.articlesRepository.save(article)
    } catch (error) {
      throw error
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const submission = await this.articlesRepository.findOneBy({ id, userId })
      submission.audio = this.fileService.getResponsePath(submission.audio, submission.UID)
      console.log(submission.audio)
      return submission
    } catch (error) {
      throw error
    }
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
          'isMultiEdition',
          'isCurrent',
          'editionId',
          'albumId',
          'isParsed',
          'isPublished',
          'isDisplayed',
          'title',
          'msg',
          'editorVersion',
          'type',
          'abbrev',
          'author',
          'createAt',
          'updateAt'
        ],
        order: {
          createAt: 'DESC'
        }
      })
      // console.log(result)
      return result
    } catch (error) {
      throw error
    }
  }

  async findEditions(editionId: string, userId: string) {
    try {
      const editions = await this.articlesRepository.find({
        where: { editionId, userId },
        relations: ['authcode'],
        select: [
          'id',
          'UID',
          'editionId',
          'isCurrent',
          'isMultiEdition',
          'albumId',
          'isParsed',
          // 'isPublished',
          // 'isDisplayed',
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
      return editions
    } catch (error) {
      throw error
    }
  }

  async updateCurrentEdition(id: string, userId: string) {
    try {
      // 使用事务来确保所有操作要么全部成功，要么全部撤销
      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()

      let article: Article
      // 切换当前版本时，新的当前版本的 album \ isPublished \ isDisplayed 应该与上一个当前版本保持一致
      try {
        article = await queryRunner.manager.findOne(Article, { where: { id, userId }, relations: ['album'] })
        if(!article) throw new Error('目标文章不存在！')
        const editions = await queryRunner.manager.find(Article, { where: { editionId: article.editionId, userId, isCurrent: true }, relations: ['album'] })
        for(const edition of editions) {
          edition.isCurrent = false
          await queryRunner.manager.save(edition)
        }
        if (editions.length > 0) {
          const edition = editions[0]
          article.isDisplayed = edition.isDisplayed
          article.isPublished = edition.isPublished
          article.album = edition.album
          article.albumId = edition.albumId
        }
        article.isCurrent = true
      
        await queryRunner.manager.save(article)

        await queryRunner.commitTransaction()
      } catch (error) {
        console.log('update current edition error')
        await queryRunner.rollbackTransaction()
        throw error
      } finally {
        await queryRunner.release()
      }
      console.log('update current edition success')
      return article
    } catch (error) {
      throw error
    }
  }

  async getUnparsedFile(id: string, userId: string) {
    try {
      // TODO 未解析文件改成存放在 unparsedFile 字段
      const article = await this.articlesRepository.findOneBy({ id, userId })
      if (!article) throw new Error('目标项目不存在！')
      console.log(article)
      if (article.isParsed) throw new Error('目标项目已解析！')
      let filepath
      if(this.common.enableCOS) {
        filepath = this.fileService.createTempFilePath('json')
        await this.fileService.fetchRemoteFile(article.unparsedFile, article.UID, filepath, true)
      } else {
        filepath = this.fileService.getLocalFilePath(article.unparsedFile, article.UID)
      }
      
      if (fs.existsSync(filepath)) {
        const file = fs.readFileSync(filepath)
        try {
          this.common.enableCOS && fs.unlinkSync(filepath) // cos的情况，读取完直接删除临时文件
        } catch (error) {
          console.log('删除临时文件失败:', error.message)
        }
        return file
      } else {
        throw new Error('目标文件不存在！')
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
          // fromEditionId: false,
          msg: false,
          removed: false
        },
        relations: {
          user: {
            UID: true as never,
            nickname: true as never,
            avatar: true as never
          }
        }
      })
      if (!article) throw new Error('文章不存在！')
      const common = this.configService.get<ReturnType<typeof commonConfig>>('common')
      article.avatar = article.avatar ? common.staticPrefix + article.avatar.split(common.publicDir.slice(1))[1] : ''
      return article
    } catch (error) {
      throw error
    }
  }

  async updatePublishStatus(id: string, status: boolean, userId: string) {
    try {
      const article = await this.articlesRepository.findOne({
        where: { id, userId }
      })
      article.isPublished = status
      const result = await this.articlesRepository.save(article)
      return result.isPublished
    } catch (error) {
      throw error
    }
  }

  async updateDisplayStatus(id: string, status: boolean, userId: string) {
    try {
      const article = await this.articlesRepository.findOne({
        where: { id, userId }
      })
      article.isDisplayed = status
      const result = await this.articlesRepository.save(article)
      return result.isDisplayed
    } catch (error) {
      throw error
    }
  }

  /** 拒稿: 将 article 标记为 remove 状态，当用户访问时会用拒稿模板覆盖，模板上可以显示拒稿理由，定时删除 */
  async refuse(id: string, msg: string, userId: string) {
    try {
      const article = await this.articlesRepository.findOne({
        where: { id, userId }
      })
      article.removed = RemovedEnum.ACTIVE
      article.refuseMsg = msg || '未填写拒稿理由' // 拒稿的情况 refuseMsg 必须有值，通过此判断是否属于拒稿的情况
      await this.articlesRepository.save(article)
      return true
    } catch (error) {
      throw error
    }
  }

  async delete(id: string, userId: string) {
    try {
      const article = await this.articlesRepository.findOne({
        where: { id, userId }
      })
      const result = await this.articlesRepository.remove(article)
      // TODO 是否删除相应文件
      return result
    } catch (error) {
      throw error
    }
  }
}
