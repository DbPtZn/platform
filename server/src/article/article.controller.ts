import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { ArticleService } from './article.service'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Article } from './article.entity'
import { ArticleFilter, ParseArticleDto } from './dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

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
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Post('all')
  async getAllArticle(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Body() filter: Partial<ArticleFilter>
  ): Promise<Pagination<Article>> {
    const result = await this.articleService.getAll(
      {
        page,
        limit,
        route: '/all'
      },
      filter
    )
    return result
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
  async parse(@Body() dto: ParseArticleDto, @Req() req, @Res() res) {
    try {
      const result = await this.articleService.parse(dto, req.user.id, req.user.UID)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

}
