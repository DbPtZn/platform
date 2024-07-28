import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.stratagy'
import { JwtAuthGuard, LocalAuthGuard } from './auth.guard'
import { UserModule } from 'src/user/user.module'
import { LoggerModule } from 'src/logger/logger.module'
@Module({
  imports: [
    UserModule,
    LoggerModule,
    PassportModule.register({ defaultStrategy: ['jwt', 'local'] }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // console.log(process.env.NODE_ENV)
        return {
          secret: configService.get('jwt.secret'), // 加密密钥
          signOptions: { expiresIn: configService.get('jwt.expiresIn') } // 配置： 保存时间
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, LocalAuthGuard, JwtAuthGuard]
})
export class AuthModule {}
