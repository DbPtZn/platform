import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UploadFile } from './uploadfile.entity'
import fs from 'fs'
import path from 'path'
import child_process from 'child_process'
import { ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import randomstring from 'randomstring'

type Category = 'audio' | 'image' | 'bgm' | 'logs' | 'json'
const __rootdirname = process.cwd()
@Injectable()
export class UploadfileService {
  constructor(
    @InjectRepository(UploadFile)
    private filesRepository: Repository<UploadFile>,
    private configService: ConfigService
  ) {}

  getFilePath(args: { filename: string; dirname: string | string[]; category: Category }, prv=false) {
    const config = this.configService.get<ReturnType<typeof commonConfig>>('common')
    const { dirname, category, filename } = args
    const dir = typeof dirname === 'string' ? dirname : dirname.join('/')
    const dirPath = path.join(prv ? config.fullPrivateDir : config.fullPublicDir, dir, category)
    return `${dirPath}/${filename}`
  }

  saveImage(args: { sourcePath: string; extname: string; dirname: string }, userId: string) {
    // console.log('saveImage')
    const { sourcePath, extname, dirname } = args
    // console.log(args)
    return new Promise<string>(async (resolve, reject) => {
      const { size, md5 } = await this.calculateFileStats(sourcePath)
      // console.log({ size, md5 })
      const file = await this.filesRepository.findOneBy({ md5, size, userId })
      if (file) {
        const isExists = fs.existsSync(file.path)
        if (isExists) {
          console.log('用户上传的图片已存在，直接返回图片路径!')
          resolve(file.path)
          return
        }
      }

      const extWithoutDot = extname.charAt(0) === '.' ? extname.slice(1) : extname
      const filename = `${randomstring.generate(3)}${new Date().getTime()}.${extWithoutDot}`
      const filepath = this.getFilePath({
        dirname,
        filename,
        category: 'image'
      })
      console.log(filepath)
      const targetDir = path.dirname(filepath)
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      // 移动文件
      fs.rename(sourcePath, filepath, err => {
        if (err) {
          reject(err)
        } else {
          // 这里可以异步处理
          this.filesRepository.save({
            userId,
            name: filename,
            extname,
            type: 'json',
            path: filepath,
            size,
            md5
          })

          resolve(filepath)
        }
      })
    })
  }

  saveAudio(args: { sourcePath: string; extname: string; dirname: string }, userId: string) {
    const { sourcePath, extname, dirname } = args

    return new Promise<string>(async (resolve, reject) => {
      const { size, md5 } = await this.calculateFileStats(sourcePath)
      // console.log({ size, md5 })
      const file = await this.filesRepository.findOneBy({ md5, size, userId })
      if (file) {
        const isExists = fs.existsSync(file.path)
        if (isExists) {
          console.log('用户上传的音频已存在，直接返回音频文件路径!')
          resolve(file.path)
          return
        }
      }

      const extWithoutDot = extname.charAt(0) === '.' ? extname.slice(1) : extname
      const filename = `${randomstring.generate(3)}${new Date().getTime()}.${extWithoutDot}`
      const filepath = this.getFilePath({
        dirname,
        filename,
        category: 'audio'
      })

      const targetDir = path.dirname(filepath)
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      // 移动文件
      fs.rename(sourcePath, filepath, err => {
        if (err) {
          reject(err)
        } else {
          // 这里可以异步处理
          this.filesRepository.save({
            userId,
            name: filename,
            extname,
            type: 'json',
            path: filepath,
            size,
            md5
          })

          resolve(filepath)
        }
      })
    })
  }

  saveJSON(args: { sourcePath: string; extname: string; dirname: string }, userId: string) {
    const { sourcePath, extname, dirname } = args

    return new Promise<string>(async (resolve, reject) => {
      const { size, md5 } = await this.calculateFileStats(sourcePath)
      // console.log({ size, md5 })
      const file = await this.filesRepository.findOneBy({ md5, size, userId })
      if (file) {
        const isExists = fs.existsSync(file.path)
        if (isExists) {
          console.log('用户上传的文件已存在，直接返回文件路径!')
          resolve(file.path)
          return
        }
      }

      const extWithoutDot = extname.charAt(0) === '.' ? extname.slice(1) : extname
      const filename = `${randomstring.generate(3)}${new Date().getTime()}.${extWithoutDot}`
      const filepath = this.getFilePath({
        dirname,
        filename,
        category: 'json'
      }, true)
      console.log(filepath)
      const targetDir = path.dirname(filepath)
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      // 移动文件
      fs.rename(sourcePath, filepath, err => {
        if (err) {
          reject(err)
        } else {
          // 这里可以异步处理
          this.filesRepository.save({
            userId,
            name: filename,
            extname,
            type: 'json',
            path: filepath,
            size,
            md5
          })

          resolve(filepath)
        }
      })
    })
  }

  async calculateFileStats(filePath: string): Promise<{ md5: string; size: number }> {
    return new Promise<{ md5: string; size: number }>((resolve, reject) => {
      // 创建子线程
      const child = child_process.fork('workers/md5-worker.mjs')

      // 向子线程发送消息
      child.send(filePath)

      // 设置超时 (10s)
      const timer = setTimeout(() => {
        child.kill()
        clearTimeout(timer)
      }, 10000)

      // 监听子线程发回的消息
      child.on('message', (msg: any) => {
        // console.log('child msg' + msg)
        if (msg.error) {
          // console.log(data.error)
          console.log('警告！计算图片相关信息失败，未能成功创建图片数据对象，图片地址:' + filePath)
          reject(msg.error)
        } else {
          resolve(msg)
        }
        clearTimeout(timer)
        child.kill()
      })

      // 监听子线程的错误
      child.on('error', error => {
        console.log(error)
        console.log('警告！计算图片相关信息失败，未能成功创建图片数据对象，图片地址:' + filePath)
        clearTimeout(timer)
        child.kill()
        reject(error)
      })
    })
  }
}
