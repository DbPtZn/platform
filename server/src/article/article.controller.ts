import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { ArticleService } from './article.service'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Article } from './article.entity'
import { AllotArticleDto, ArticleFilter, ParseArticleDto } from './dto'
import { AuthGuard } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly configService: ConfigService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getArticle(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.articleService.findOne(id, req.user.id)
      const common = this.configService.get<ReturnType<typeof commonConfig>>('common')
      if(result.audio) {
        result.audio = common.staticPrefix + result.audio.split(common.publicDir.slice(1))[1]
      }
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async getArticleList(
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
      const result = await this.articleService.find(
        {
          page,
          limit,
          // route: '/list'
        },
        filter,
        req.user.id
      )
      // console.log(result)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('unparsedfile/:id')
  async getUnparsedFile(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.articleService.getUnparsedFile(id, req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('parse')
  async parse(@Body() dto: ParseArticleDto, @Req() req, @Res() res) {
    try {
      const result = await this.articleService.parse(dto, req.user.id, req.user.UID)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('allot')
  async allot(@Body() dto: AllotArticleDto, @Req() req, @Res() res) {
    try {
      const result = await this.articleService.allot(dto, req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Post('/blog/list')
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

  @Get('/blog/:id')
  async getBlogArticle(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.articleService.findOneToBlog(id)
      const common = this.configService.get<ReturnType<typeof commonConfig>>('common')
      if(result.audio) {
        result.audio = common.staticPrefix + result.audio.split(common.publicDir.slice(1))[1]
      }
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

}
