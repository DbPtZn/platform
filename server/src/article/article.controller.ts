import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { ArticleService } from './article.service'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Article } from './article.entity'
import { AuthGuard } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import { ArticleFilter } from './dto/getList.dto'
import { RemovedEnum } from 'src/enum'

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly configService: ConfigService
  ) {}

  @Post('list')
  async getBlogArticleList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Body() filter: Partial<ArticleFilter>,
    @Req() req,
    @Res() res
  ) {
    // console.log(page)
    // console.log(limit)
    // console.log(filter)
    try {
      const result = await this.articleService.findAll(
        {
          page,
          limit,
          // route: '/list'
        },
        filter
      )
      // console.log(result)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Get('/:id')
  async getBlogArticle(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      // console.log(id)
      const result = await this.articleService.findOne(id)
      console.log(result.refuseMsg)
      if(result.removed === RemovedEnum.ACTIVE && result.refuseMsg) {
        return res.status(307).send({ refused: true, refuseMsg: result.refuseMsg })
      }
      if(!result.isPublished) {
        return res.status(307).send({ examining: true, msg: '正在审核中...' })
      }
      const common = this.configService.get<ReturnType<typeof commonConfig>>('common')
      if(result.audio) {
        result.audio = common.staticPrefix + result.audio.split(common.publicDir.slice(1))[1]
      }
      // console.log(result.user)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

}
