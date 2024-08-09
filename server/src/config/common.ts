import { registerAs } from '@nestjs/config'
import path from 'path'
export default registerAs('common', () => ({
  openValidateCode: process.env.V_CODE_OPEN === 'true', // 是否开启验证码
  systemDir: process.env.USER_DIR || '', // 用户目录
  appDir: process.env.APP_DIR,
  publicDir: process.env.PUBLIC_DIR || '', // 公共目录
  staticPrefix: process.env.STATIC_RESOURCE_PREFIX || `${process.env.PUBLIC_DIR}`,
  tempDir: process.env.TEMP_DIR || '',
  privateDir: process.env.PRIVATE_DIR || '', // 私有目录
  logDir: process.env.LOG_DIR || '', // 日志目录
  logOpen: process.env.LOG_OPEN === 'true', // 是否开启系统日志

  fullPublicDir: path.join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.PUBLIC_DIR),
  fullPrivateDir: path.join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.PRIVATE_DIR),
  fullTempDir: path.join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.TEMP_DIR),
  fullLogDir: path.join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.LOG_DIR),

  clientDomain: process.env.CLIENT_DOMAIN, // 客户端域名
}))
