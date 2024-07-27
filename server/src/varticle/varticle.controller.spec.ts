import { Test, TestingModule } from '@nestjs/testing';
import { VarticleController } from './varticle.controller';
import { VarticleService } from './varticle.service';

describe('VarticleController', () => {
  let controller: VarticleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VarticleController],
      providers: [VarticleService],
    }).compile();

    controller = module.get<VarticleController>(VarticleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
