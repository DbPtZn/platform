import { Module } from '@nestjs/common'
import { AuthcodeService } from './authcode.service'
import { AuthcodeController } from './authcode.controller'
import { Authcode } from './authcode.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Authcode])],
  controllers: [AuthcodeController],
  providers: [AuthcodeService],
  exports: [AuthcodeService]
})
export class AuthcodeModule {}
