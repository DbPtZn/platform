import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common'
import { AuthcodeService } from './authcode.service'
import { CreateAuthcodeDto } from './dto/create-authcode.dto'
import { AuthGuard } from '@nestjs/passport'
import { UpdateAuthcodeDto } from './dto/update.dto'
// import { UpdateAuthcodeDto } from './dto/update-authcode.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('authcode')
export class AuthcodeController {
  constructor(private readonly authcodeService: AuthcodeService) {}

  @Get()
  async findAll(@Req() req, @Res() res) {
    try {
      const authcodes = await this.authcodeService.findAll(req.user.id)
      res.send(authcodes)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const authcode = await this.authcodeService.findOne(id, req.user.id)
      res.send(authcode)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Post()
  async create(@Req() req, @Res() res) {
    try {
      console.log(req.user.id)
      const result = await this.authcodeService.add(req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Patch()
  async update(@Body() dto: UpdateAuthcodeDto, @Req() req, @Res() res) {
    try {
      const result = await this.authcodeService.update(dto, req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.authcodeService.delete(id, req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }
}
