import { Controller } from '@nestjs/common';
import { UploadfileService } from './uploadfile.service';

@Controller('uploadfile')
export class UploadfileController {
  constructor(private readonly uploadfileService: UploadfileService) {}
}
