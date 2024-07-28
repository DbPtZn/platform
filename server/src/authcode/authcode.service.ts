import { Injectable } from '@nestjs/common'
import { CreateAuthcodeDto } from './dto/create-authcode.dto'
import { Authcode } from './authcode.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateAuthcodeDto } from './dto/update.dto'
// import { UpdateAuthcodeDto } from './dto/update-authcode.dto';

@Injectable()
export class AuthcodeService {
  constructor(
    @InjectRepository(Authcode)
    private authcodesRepository: Repository<Authcode>
  ) {}

  add(userId: string) {
    try {
      return this.authcodesRepository.create({
        userId: userId,
        name: '',
        code: '',
        desc: ''
      })
    } catch (error) {
      throw error
    }
  }

  findAll(userId: string) {
    try {
      return this.authcodesRepository.findOneBy({ userId: userId })
    } catch (error) {
      throw error
    }
  }

  findOne(id: string, userId: string) {
    try {
      return this.authcodesRepository.findOneBy({ id, userId })
    } catch (error) {
      throw error
    }
  }

  findOneByCode(code: string, userId: string) {
    try {
      return this.authcodesRepository.findOneBy({ code, userId })
    } catch (error) {
      throw error
    }
  }

  async update(dto: UpdateAuthcodeDto, userId: string) {
    try {
      const { id, name, code, desc, disabled  } = dto
      const authcode = await this.authcodesRepository.findOneBy({ id, userId })
      authcode.name = name
      authcode.code = code
      authcode.desc = desc
      authcode.disabled = disabled
      return this.authcodesRepository.save(authcode)
    } catch (error) {
      throw error
    }
  }

  delete(id: string, userId: string) {
    try {
      return this.authcodesRepository.delete({ id, userId })
    } catch (error) {
      throw error
    }
  }
}
