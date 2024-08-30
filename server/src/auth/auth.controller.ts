import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { REST } from 'src/enum'
import { LocalAuthGuard } from './auth.guard'
import { CreateUserDto } from 'src/user/dto/create.dto'
import { LoginDto } from './dto/login.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`/register`)
  register(@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
      // console.log(createUserDto)
      this.authService
        .register(createUserDto)
        .then(user => {
          res.status(201).send({ id: user.id })
        })
        .catch(error => {
          console.log(error)
          res.status(400).send(error.message)
        })
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  /** 登录请求 */
  // @UseGuards(AuthGuard('local'))
  @UseGuards(LocalAuthGuard)
  @Post(`/login`)
  async login(@Body() loginDto: LoginDto, @Req() req, @Res() res) {
    // console.log(loginDto)
    // console.log('验证码：' + this.authService.validateCode(loginDto.code, loginDto.hashCode))
    // if (!this.authService.validateCode(loginDto.code, loginDto.hashCode)) return res.status(400).send('验证码错误！')
    const token = await this.authService.login(req.user)
    if (token) {
      res.status(200).send({ type: 'server', token })
    } else {
      res.status(401).send('登录验证失败')
    }
  }

  @Get(`/identify`)
  async identify(@Req() req, @Res() res) {
    try {
      // console.log(`req.headers.authorization:`, req.headers.authorization)
      const authorization = req.headers.authorization.substring(7).trim();
      const token = await this.authService.identify(authorization)
      // console.log(`token:`, token)
      res.status(200).send({ type: 'server', token })
    } catch (error) {
      res.status(401).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`/refresh`)
  async refreshToken(@Req() req, @Res() res) {
    try {
      // console.log(`/refresh`)
      const token = await this.authService.refreshToken(req.user.id)
      res.status(200).send({ type: 'server', token: token })
    } catch (error) {
      res.status(400).send(error.message)
    }
  }
}
