import { Body, Controller, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { UploadfileService } from './uploadfile.service'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { extname } from 'path'
import { ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'

@Controller('upload')
export class UploadfileController {
  constructor(
    private readonly fileService: UploadfileService,
    private readonly configService: ConfigService
    ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(`/img`)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImg(@UploadedFile() file, @Body() formData, @Req() req, @Res() res) {
    try {
      // const common = this.configService.get<ReturnType<typeof commonConfig>>('common')
      // console.log(file)
      // console.log(formData.dirname) // 暂不考虑该方案
      const filePath = await this.fileService.upload(file, req.user.id, req.user.UID)
      console.log('上传文件-UID:', req.user.UID)
      // console.log(filePath)
      // console.log(common.publicDir)
      // console.log(filePath.split(common.publicDir.slice(1)))
      // const path = filePath
      console.log(filePath)
      res.status(200).send(filePath)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }
}
