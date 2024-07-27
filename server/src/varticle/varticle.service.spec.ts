import { Test, TestingModule } from '@nestjs/testing';
import { VarticleService } from './varticle.service';

describe('VarticleService', () => {
  let service: VarticleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VarticleService],
    }).compile();

    service = module.get<VarticleService>(VarticleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
