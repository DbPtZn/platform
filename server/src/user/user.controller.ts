import { Body, Controller, Get, Param, Patch, Req, Res, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard } from '@nestjs/passport'
import { UpdateUserPwdDto } from './dto/update-pwd.dto'
import { UpdateConfigDto } from './dto/updateConfig.dto'
import { UpdateInfoDto } from './dto/update-info.dto'
import { UpdateAlbumSequenceDto } from './dto/updateAlbumSequence.dto'


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(`/info`)
  async getUserInfo(@Req() req, @Res() res) {
    try {
      const info = await this.userService.findUserInfo(req.user.id)
      // console.log(info)
      return res.status(200).send(info)
    } catch (error) {
      return res.status(400).send('获取用户信息失败！' + error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`info`)
  async updateInfo(@Body() updateInfoDto: UpdateInfoDto, @Req() req, @Res() res) {
    // console.log('更新用户数据：')
    // console.log(updateUserDto)
    try {
      const updateAt = await this.userService.updateInfo(updateInfoDto, req.user.id)
      res.status(200).send(updateAt)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`pwd`)
  async updatePwd(@Body() updateUserPwdDto: UpdateUserPwdDto, @Req() req, @Res() res) {
    // console.log('更新用户密码：' + updateUserPwdDto)
    try {
      const updateAt = await this.userService.updatePwd(updateUserPwdDto, req.user.id)
      res.status(200).send(updateAt)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`config`)
  async updateConfig(@Body() dto: UpdateConfigDto, @Req() req, @Res() res) {
    try {
      const result = await this.userService.updateConfig(dto, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }


  @UseGuards(AuthGuard('jwt'))
  @Patch('/receiver/:status')
  async update(@Param('status') status: 0 | 1 | 2, @Req() req, @Res() res) {
    try {
      const result = await this.userService.updateReceiverConfig(status, req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('albumSequence')
  async updateAlbumSequence(@Body() dto: UpdateAlbumSequenceDto, @Req() req, @Res() res) {
    try {
      const result = await this.userService.updateAlbumsSequence(dto, req.user.id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @Get('list')
  async getList(@Req() req, @Res() res) {
    try {
      const users = await this.userService.findAll()
      res.send(users)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }
  
}
