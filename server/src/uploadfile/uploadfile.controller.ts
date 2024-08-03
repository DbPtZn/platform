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
      // console.log(file)
      // console.log(formData.dirname) // 暂不考虑该方案
      const filePath = await this.fileService.saveImage(
        {
          sourcePath: file.path,
          extname: extname(file.originalname),
          dirname: req.user.UID
        },
        req.user.id
      )
      const common = this.configService.get<ReturnType<typeof commonConfig>>('common')
      console.log(filePath)
      console.log(common.publicDir)
      console.log(filePath.split(common.publicDir.slice(1)))
      const path = common.staticPrefix + filePath.split(common.publicDir.slice(1))[1]
      console.log(path)
      res.status(200).send(path)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }
}
