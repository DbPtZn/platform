import { AlbumService } from './album.service'
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CreateAlbumDto } from './dto/create-album.dto'

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreateAlbumDto, @Req() req, @Res() res) {
    try {
      const result = await this.albumService.create(dto, req.user.id, req.user.UID)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  async getAlbums(@Req() req, @Res() res) {
    try {
      const result = await this.albumService.getAlbums(req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getAlbumList(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.albumService.getAlbum(id, req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Get('blog/list/:UID')
  async getBlogAlbumList(@Param('UID') UID: string, @Req() req, @Res() res) {
    try {
      const result = await this.albumService.getBlogAlbumList(UID)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }
}
