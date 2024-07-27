import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { UploadFile } from './uploadfile.entity'

@Injectable()
export class UploadfileService {
  constructor(
    @InjectRepository(UploadFile)
    private filesRepository: MongoRepository<UploadFile>
  ) {}
}
