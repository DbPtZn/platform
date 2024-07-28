import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Query, Req, Res, UseGuards } from '@nestjs/common'
import { ArticleService } from './article.service'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Article } from './article.entity'
import { ArticleFilter } from './dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  async getArticleList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Body() filter: Partial<ArticleFilter>,
    @Req() req,
    @Res() res
  ) {
    return await this.articleService.find(
      {
        page,
        limit,
        route: '/list'
      },
      filter,
      req.user.id
    )
  }

  @Get('')
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
}
