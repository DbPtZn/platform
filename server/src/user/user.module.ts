import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User } from './user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import { UserMiddleware } from './user.middleware'

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
  constructor(
    private readonly configService: ConfigService
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const common = this.configService.get<ReturnType<typeof commonConfig>>('common')
    // 开启 sso 单点登录的时候，会拦截 login | register 请求
    common.ssoEnable && consumer.apply(UserMiddleware).forRoutes(
      // { path: `/user/register/:type`, method: RequestMethod.PATCH },
      { path: `/user/pwd`, method: RequestMethod.PATCH },
    )
  }
}
