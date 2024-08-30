import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import bcrypt from 'bcryptjs'
import { LoggerService } from 'src/logger/logger.service'
import { User } from 'src/user/user.entity'
import { CreateUserDto } from 'src/user/dto/create.dto'
import randomstring from 'randomstring'
import { HttpService } from '@nestjs/axios'
import { commonConfig } from 'src/config'
@Injectable()
export class AuthService {
  private readonly common: ReturnType<typeof commonConfig>
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
  ) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
  }

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
      this.logger.log(`${user.account} 用户登录失败！原因： ${error.message}`)
      return error
    }
  }

   /** sso 单点登录模式的认证鉴权 */
   async identify(token: string) {
    return new Promise<string>(async (resolve, reject) => {
      await this.httpService.axiosRef.get(`${this.common.ssoDomain}/auth/identify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(async resp => {
        if(resp.status === 200) {
          const account = resp.data.account as string
          // console.log('account:', account)
          let user = await this.userService.findOneByAccount(account)
          // 用户不存在,说明是新用户第一次登录,创建新用户
          if(!user) {
            try {
              console.log('------ 首次登录，创建新用户 ------')
              console.log('新用户:', account)
              user = await this.userService.create({
                nickname: `新用户-${randomstring.generate(5)}`,
                account: account,
                password: randomstring.generate(12)
              })
              this.logger.log(`为 ${account} 创建新用户成功！`)
              this.httpService.axiosRef.patch(`${this.common.ssoDomain}/user/register/platform`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }).catch(err => {
                // platform 注册状态只为记录用户使用情况，不影响用户实际使用，错误不做处理
                this.logger.error(`通知 sso 系统更新 ${account} 的 platform 注册状态失败！`)
              })
            } catch (error) {
              this.logger.error(`为 ${account} 创建新用户失败, ${error.message}`)
              throw new Error('首次登录, 创建新用户失败!')
            }
          }
          // rfh：刷新时间
          const rfh = this.configService.get('jwt.refreshIn')
          const serverToken = this.jwtService.sign({ userId: user.id, account: user.account, UID: user.UID, rfh: (Math.floor(Date.now()/1000)) + rfh })
          resolve(serverToken)
        }
      }).catch(err => {
        if(err.status === 401) {
          reject('sso-token 失效')
        } else {
          reject(err)
        }
      })
    })
  }

  async refreshToken(id: string) {
    try {
      const user = await this.userService.findOneById(id)
      if (!user) throw new UnauthorizedException('用户不存在')
      const rfh = this.configService.get('jwt.refreshIn')
      const token = this.jwtService.sign({ userId: user.id, account: user.account, UID: user.UID, rfh: (Math.floor(Date.now()/1000)) + rfh })
      return token
    } catch (err) {
      throw err
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
