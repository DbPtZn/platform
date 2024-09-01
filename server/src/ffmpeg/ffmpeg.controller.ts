import { Controller } from '@nestjs/common';
import { FfmpegService } from './ffmpeg.service';

@Controller('ffmpeg')
export class FfmpegController {
  constructor(private readonly ffmpegService: FfmpegService) {}
}
