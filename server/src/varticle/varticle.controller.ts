import { Controller } from '@nestjs/common';
import { VarticleService } from './varticle.service';

@Controller('varticle')
export class VarticleController {
  constructor(private readonly varticleService: VarticleService) {}
}
