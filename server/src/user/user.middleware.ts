import { Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response, NextFunction } from 'express'
import { commonConfig } from 'src/config'
import proxy from 'express-http-proxy'

@Injectable()
export class UserMiddleware implements NestMiddleware {
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