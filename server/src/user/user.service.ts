import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ReceiverConfig, User } from './user.entity'
import { CreateUserDto } from './dto/create.dto'
import bcrypt from 'bcryptjs'
import path from 'path'
import fs from 'fs'
import { UpdateColumnSequenceDto } from './dto/updateColumnSequence.dto'
import { ConfigService } from '@nestjs/config'
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}
  /** 创建新用户 */
  async create(createUserDto: CreateUserDto) {
    try {
      // 获取注册信息
      const { account, password, nickname } = createUserDto
      console.log(createUserDto)
      const isValid = /^[a-zA-Z0-9@.]+$/.test(account)
      if (!isValid) throw new Error('账号名称包含非法字符！')
      if (password.includes(' ')) throw new Error('密码不能包含空格！')

      // 判断该用户是否存在
      const isUserExist = await this.findOneByAccount(account)
      if (isUserExist) {
        throw new Error('该账号已注册！')
      }
      const UID = await this.generateUID()
      // 密码哈希加盐
      const salt = bcrypt.genSaltSync()
      const encryptedPassword = bcrypt.hashSync(password, salt)
      // console.log(encryptedPassword)
      const receiverConfig: ReceiverConfig = {
        status: 0,
        autoParse: false,
        sizeLimit: 0
      }
      const info = {
        email: '',
        phone: ''
      }
      const data = {
        account,
        nickname,
        encryptedPassword,
        receiverConfig,
        columnSequence: [],
        info,
        UID
      }
      const user = await this.usersRepository.save(data)
      console.log(user)
      return user
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  /** 通过账号查询用户 */
  async findOneByAccount(account: string) {
    try {
      const user = await this.usersRepository.findOneBy({ account: account })
      return user || null
    } catch (error) {
      throw error
    }
  }

  async findOneById(id: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id })
      return user
    } catch (error) {
      throw error
    }
  }

  async findUserInfo(id: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id }
      })
      const publicDir = this.configService.get('common.publicDir')
      const prefix = this.configService.get('common.staticPrefix')
      user.avatar = user.avatar ? prefix + user.avatar.split(publicDir)[1] : ''
      return user
    } catch (error) {
      throw error
    }
  }

  async findAll() {
    try {
      const users = await this.usersRepository.find({
        where: {},
        select: ['UID', 'nickname', 'avatar', 'desc', 'updateAt', 'createAt']      
      })
      users.forEach(user => {
        const publicDir = this.configService.get('common.publicDir')
        const prefix = this.configService.get('common.staticPrefix')
        user.avatar = user.avatar ? prefix + user.avatar.split(publicDir)[1] : ''
      })
      return users
    } catch (error) {
      throw error
    }
  }

  /** 生成用户私有文件夹的地址 */
  async generateUID() {
    let UID = generateRandomStr()
    const __rootdirname = process.cwd()
    // 校验该地址是否已经存在
    let isExist = await this.usersRepository.existsBy({ UID })
    let fullPath = path.join(__rootdirname, 'public', UID)
    console.log(fullPath)
    console.log(isExist)
    while (fs.existsSync(fullPath) || isExist) {
      console.log('该用户文件夹已存在，重新生成')
      UID = generateRandomStr()
      isExist = await this.usersRepository.existsBy({ UID })
      fullPath = path.join(__rootdirname, 'public', UID)
    }
    console.log(UID)
    return UID
  }

  /** 用户密码登录验证 */
  async validateUser(account: string, password: string) {
    try {
      // 用户是否存在
      const user = await this.usersRepository.findOne({
        where: { account: account },
        select: ['encryptedPassword', 'id', 'UID', 'account']
      })
      if (!user) return null
      // 用户密码是否正确
      const valid = bcrypt.compareSync(password, user.encryptedPassword)
      if (valid) return user
      return null
    } catch (error) {
      throw error
    }
  }

  /** 更新接收器状态 */
  async updateReceiverConfig(status: 0 | 1 | 2, id: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id })
      user.receiverConfig.status = Number(status) as 0 | 1 | 2
      return this.usersRepository.save(user)
    } catch (error) {
      throw error
    }
  }

  /** 更新比较麻烦，需要考虑增删改的情况，所以先直接用前端改完的数据覆盖 */
  async updateColumnsSequence(dto: UpdateColumnSequenceDto, id: string) {
    try {
      const { sequence } = dto
      // console.log(sequence)
      const user = await this.usersRepository.findOneBy({ id })
      user.columnSequence = sequence
      return this.usersRepository.save(user)
    } catch (error) {
      throw error
    }
  }
}

/** 生成随机字符串 */
function generateRandomStr(num = 8) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''

  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}
