import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import bcrypt from 'bcryptjs'
import { LoggerService } from 'src/logger/logger.service'
import { User } from 'src/user/user.entity'
import { CreateUserDto } from 'src/user/dto/create.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService
  ) {}

  /** 注册 */
  register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  /** 登录：生成 token */
  async login(user: User) {
    try {
      if (!user) {
        this.logger.error('用户登录失败！邮箱或密码错误！')
        throw new UnauthorizedException('用户邮箱或密码错误！')
      }
      this.logger.log(`${user.account} 用户正在登录...`)
      const token = this.jwtService.sign({ userId: user.id, account: user.account, UID: user.UID })
      this.logger.log(`${user.account} 用户登录成功！`)
      return token
    } catch (error) {
      return error
    }
  }

  /** 用户密码登录验证 */
  async validateUser(account: string, password: string) {
    // 用户是否存在
    const user = await this.userService.findOneByAccount(account)
    // console.log(user)
    if (!user) return null
    // 用户密码是否正确
    const valid = bcrypt.compareSync(password, user.encryptedPassword)
    if (valid) return user
    return null
  }
}
