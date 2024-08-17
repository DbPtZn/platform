import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, ParseBoolPipe, Patch, Post, Query, Req, Res, UseGuards, Delete } from '@nestjs/common'
import { SubmissionService } from './submission.service'
import { AuthGuard } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import { ArticleFilter } from 'src/types'
import { RefuseDto } from './dto/refuse.dto'
import { AllotArticleDto, ParseArticleDto } from './dto'

@UseGuards(AuthGuard('jwt'))
@Controller('submission')
export class SubmissionController {
  constructor(
    private readonly submissionService: SubmissionService,
    private readonly configService: ConfigService
  ) {}

  @Get('/:id')
  async getArticle(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.submissionService.findOne(id, req.user.id)
      const common = this.configService.get<ReturnType<typeof commonConfig>>('common')
      if (result.audio) {
        result.audio = common.staticPrefix + result.audio.split(common.publicDir.slice(1))[1]
      }
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Get('/editions/:id')
  async getEditions(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.submissionService.findEditions(id, req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Patch('/current/:id')
  async updateCurrentEdition(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.submissionService.updateCurrentEdition(id, req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

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
      const result = await this.submissionService.find(
        {
          page,
          limit
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

  @Get('unparsedfile/:id')
  async getUnparsedFile(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.submissionService.getUnparsedFile(id, req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Patch('parse')
  async parse(@Body() dto: ParseArticleDto, @Req() req, @Res() res) {
    try {
      const result = await this.submissionService.parse(dto, req.user.id, req.user.UID)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Patch('allot')
  async allot(@Body() dto: AllotArticleDto, @Req() req, @Res() res) {
    try {
      const result = await this.submissionService.allot(dto, req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Patch('publish/:id')
  async updatePublishStatus(
    @Param('id') id: string,
    @Query('status', new DefaultValuePipe(false), ParseBoolPipe) status: boolean, 
    @Req() req,
    @Res() res) {
    try {
      const result = await this.submissionService.updatePublishStatus(id, status, req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Patch('display/:id')
  async updateDisplayStatus(
    @Param('id') id: string,
    @Query('status', new DefaultValuePipe(false), ParseBoolPipe) status: boolean, 
    @Req() req,
    @Res() res) {
    try {
      const result = await this.submissionService.updateDisplayStatus(id, status, req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  
  @Patch('refuse')
  async refuse(@Body() dto: RefuseDto, @Req() req, @Res() res) {
    try {
      const { id, msg } = dto
      const result = await this.submissionService.refuse(id, msg, req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.submissionService.delete(id, req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

}
