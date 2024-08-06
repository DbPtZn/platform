import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Album } from 'src/album/album.entity'
import { Article } from 'src/article/article.entity'
import { Authcode } from 'src/authcode/authcode.entity'
import { UploadfileService } from 'src/uploadfile/uploadfile.service'
import { User } from 'src/user/user.entity'
import { Repository } from 'typeorm'
import fsx from 'fs-extra'
import { RemovedEnum } from 'src/enum'

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    // @InjectRepository(User)
    // private usersRepository: Repository<User>,
    // @InjectRepository(Authcode)
    // private authcodesRepository: Repository<Authcode>,
    // @InjectRepository(Album)
    // private albumsRepository: Repository<Album>,
    // private readonly fileService: UploadfileService,
    private readonly configService: ConfigService
    // private readonly userService: UserService
  ) {}

  async updatePublishStatus(id: string, status: boolean, userId: string) {
    try {
      const article = await this.articlesRepository.findOne({
        where: { id, userId }
      })
      article.isPublished = status
      return this.articlesRepository.save(article)
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
      return this.articlesRepository.save(article)
    } catch (error) {
      throw error
    }
  }

  /** 拒稿: 将 article 标记为 remove 状态，当用户访问时会用拒稿模板覆盖，模板上可以显示拒稿理由，定时删除 */
  async refuse(id: string, userId: string) {
    try {
      const article = await this.articlesRepository.findOne({
        where: { id, userId }
      })
      article.removed = RemovedEnum.ACTIVE
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
      return this.articlesRepository.save(article)
    } catch (error) {
      throw error
    }
  }
}
