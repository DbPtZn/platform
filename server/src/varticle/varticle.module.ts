import { Module } from '@nestjs/common'
import { VarticleService } from './varticle.service'
import { VarticleController } from './varticle.controller'
import { VArticle } from './varticle.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([VArticle])],
  controllers: [VarticleController],
  providers: [VarticleService]
})
export class VarticleModule {}
