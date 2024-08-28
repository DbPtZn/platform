import { registerAs } from '@nestjs/config'

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
  /** 刷新时间 */
  refreshIn: Number(process.env.JWT_REFRESH_IN)
}))
