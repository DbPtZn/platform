import { Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response, NextFunction } from 'express'
import proxy from 'express-http-proxy'
import { commonConfig } from 'src/config'
@Injectable()
export class AuthMiddleware implements NestMiddleware {

  private readonly common: ReturnType<typeof commonConfig>

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
  }
  
  use(req: Request, res: Response, next: NextFunction) {
    return proxy(this.common.ssoDomain)(req, res, next)
  }
}
