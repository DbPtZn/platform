import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  Res,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe
} from '@nestjs/common'
import { ReceiverService } from './receiver.service'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { CreateArticleDto } from './dto/receive.dto';

@Controller('receiver')
export class ReceiverController {
  constructor(private readonly receiverService: ReceiverService) {}

  @Post('/:params')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'jsonDocs', maxCount: 1 },
      { name: 'audios', maxCount: 1 }
    ])
  )
  async receive(
    @Param('params') params: string,
    // @UploadedFiles() files: any[],
    @UploadedFiles(
      new ParseFilePipe({
        exceptionFactory(error) {
          console.log(error)
        }
      })
    )
    files: { jsonDocs: Express.Multer.File[]; audios: Express.Multer.File[] },
    @Body() formdata: CreateArticleDto,
    @Req() req,
    @Res() res
  ) {
    // console.log(files)
    // console.log(document)
    // const { document, audio } = files
    console.log('接收到新的投稿！')
    const [UID, code] = params.split('&')
    this.receiverService
      .receive(formdata, files, UID, code)
      .then(result => {
        console.log('接收投稿成功！')
        res.status(200).send({ editionId: result.editionId })
      })
      .catch(err => {
        console.log(err)
        res.status(400).send(err)
      })
  }
}
