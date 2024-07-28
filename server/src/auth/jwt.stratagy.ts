import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
  ) {
    const secret = configService.get('jwt.secret') || 'secret'
    // console.log('secret', secret)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret
    })
  }

  // 2. 系统自动验证token合法性，并将由token编译出的json作为参数传入validate方法中。
  async validate(payload: any) {
    // console.log('payload', payload)
    const authInfo = { id: payload.userId, account: payload.account, UID: payload.UID }
    return authInfo
  }
}
