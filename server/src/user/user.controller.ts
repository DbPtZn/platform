import { Body, Controller, Get, Param, Patch, Req, Res, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard } from '@nestjs/passport'


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
  @Patch('/receiver/:status')
  async update(@Param('status') status: 0 | 1 | 2, @Req() req, @Res() res) {
    try {
      const result = await this.userService.updateReceiverConfig(status, req.user.id)
      res.send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }
  
}
