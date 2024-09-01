import { Test, TestingModule } from '@nestjs/testing';
import { FfmpegController } from './ffmpeg.controller';
import { FfmpegService } from './ffmpeg.service';

describe('FfmpegController', () => {
  let controller: FfmpegController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FfmpegController],
      providers: [FfmpegService],
    }).compile();

    controller = module.get<FfmpegController>(FfmpegController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
