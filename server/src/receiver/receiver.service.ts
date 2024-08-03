import { Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { extname } from 'path'
import * as fs from 'fs'
import { AuthcodeService } from 'src/authcode/authcode.service'
import { ArticleService } from 'src/article/article.service'
import { UploadfileService } from 'src/uploadfile/uploadfile.service'
import { CreateArticleDto } from './dto/receive.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/user/user.entity'

@Injectable()
export class ReceiverService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly articleService: ArticleService,
    private readonly authcodeService: AuthcodeService,
    private readonly fileService: UploadfileService
  ) {}

  async receive(
    dto: CreateArticleDto,
    files: { jsonDocs: Express.Multer.File[]; audios: Express.Multer.File[] },
    UID: string,
    code: string
  ) {
    const { jsonDocs, audios } = files
    const jsonDoc = jsonDocs ? jsonDocs[0] : undefined
    const audio = audios ? audios[0] : undefined

    // 查询用户
    const user = await this.usersRepository.findOneBy({ UID })
    /** 用户验证 */
    if(!user) throw new Error('用户不存在！')
    if (user.receiverConfig.status === 2) {
      fs.unlinkSync(jsonDoc.path)
      fs.unlinkSync(audio.path)
      throw new Error('目标当前拒绝任何投稿！' )
    }

    /** 授权码验证 */
    let authcodeId = ''
    console.log(user.receiverConfig)
    if(user.receiverConfig.status === 1 && code) {
      const authcode = await this.authcodeService.validateCode(code, user.id)
      console.log(authcode)
      authcodeId = authcode.id
      if(!authcode) {
        fs.unlinkSync(jsonDoc.path)
        fs.unlinkSync(audio.path)
        throw new Error('授权码验证失败！')
      }
    }
    // console.log(authcodeId)
    const data: CreateArticleDto = {
      isParsed: false,
      editorVersion: '',
      UID,
      authcodeId,
      penname: dto.penname || '佚名',
      email: dto.email || '',
      blog: dto.blog || '',
      msg: dto.msg || '',
      type: dto.type as any || 'other',
      title: dto.title || '',
      abbrev: dto.abbrev || '',
      content: jsonDoc.path,
      audio: audio?.path || '',
      duration: dto.duration || 0,
      wordage: dto.wordage || 0,
    }

    
    /** 数据文档 */
    const filepath = await this.fileService.saveJSON({
      dirname: UID,
      extname: 'json',
      sourcePath: jsonDoc.path,
    }, user.id)

    data.content = filepath

    /** 处理音频文件 */
    if (audio) {
      const audioPath = await this.fileService.saveAudio({
        dirname: user.UID,
        sourcePath: audio.path,
        extname: extname(audio.path),
      }, user.id)
      data.audio = audioPath
    }
    // console.log(data)
    // console.log(data.keyframeSequence)

    // 检测是否属于更新投稿(有附带版本 id 一般属于更新投稿)
    let fromEditionId = ''
    if(dto.editionId) {
      const result = await this.articleService.queryEditionExists(dto.editionId)
      if(result) {
        fromEditionId = dto.editionId
      }
    }


    const result = await this.articleService.create(
      data,
      user.id,
      fromEditionId
    )
    return { editionId: result.editionId || dto.editionId }
  }

  reject() {}
}

// 目前编辑器无法在服务端渲染实例，
// const isParsed = user.receiverConfig ? user.receiverConfig.autoParse : false
// const isParsed = true
// if (isParsed) {
//   // 将 json 文件解析出来
//   const str = fs.readFileSync(docpath, 'utf8')
//   const doc = JSON.parse(str)
//   // console.log(doc)
//   // console.log(doc.content.length)
//   // const content = await this.editorService.convert(doc.content, user.dirname)
//   data.content = doc.content
//   data.duration = Number(doc.duration)
//   data.promoterSequence = doc.promoterSequence || []
//   data.keyframeSequence = doc.keyframeSequence || []
//   data.subtitleSequence = doc.subtitleSequence || []
//   data.subtitleKeyframeSequence = doc.subtitleKeyframeSequence || []
//   fs.unlinkSync(docpath) // 确认解析完成后移除 JSON 文件
// }
