import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UploadFile } from './uploadfile.entity'
import fs from 'fs'
import os from 'os'
import path, { basename } from 'path'
import child_process from 'child_process'
import { ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import randomstring from 'randomstring'
import { BucketService } from 'src/bucket/bucket.service'

// type Category = 'audio' | 'image' | 'bgm' | 'logs' | 'json'
export interface LocalUploadFile extends Partial<Express.Multer.File> {
  filename: string
  path: string
  mimetype: 'image/jpeg' | 'image/png' | 'image/gif' | 'audio/wav' | 'audio/ogg' | 'application/json' |string
}

@Injectable()
export class UploadfileService {
  private readonly common: ReturnType<typeof commonConfig>
  constructor(
    @InjectRepository(UploadFile)
    private filesRepository: Repository<UploadFile>,
    private readonly bucketService: BucketService,
    private readonly configService: ConfigService
  ) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
  }

  /** 获取本地目录 */
  getLocalDir(dirname: string, prv?: boolean) {
    const common = this.common
    const dirPath = path.join(prv === true ? common.fullPrivateDir : common.fullPublicDir, dirname)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    return dirPath
  }

  getLocalFilePath(filename: string, dirname: string, prv = false) {
    const dirPath = this.getLocalDir(dirname, prv)
    return `${dirPath}/${filename}`
  }

  /**
   * 根据给定信息创建文件路径 (本地文件系统路径)
   */
  createLocalFilePath(filename: string, dirname: string, prv = false) {
    const dirPath = this.getLocalDir(dirname, prv)
    const filepath = `${dirPath}/${filename}`
    return filepath
  }

  /** 参数： 拓展名， 如 '.wav' */
  createTempFilePath(extname: string) {
    const extWithoutDot = extname.charAt(0) === '.' ? extname.slice(1) : extname
    return path.join(os.tmpdir(), `${randomstring.generate(5)}-${new Date().getTime()}.${extWithoutDot}`)
  }

  /**
   * 获取目录（本地模式时，若目录不存在会自动创建目录）
   * @param dirname 用户目录名称
   * @param prv 是否为私密文件夹
   * @returns 文件存储目录
   */
  getDir(dirname: string, prv = false) {
    if (this.common.enableCOS) {
      return `${this.common.proxyDomain}/${dirname}`
    }
    const common = this.common
    const dirPath = path.join(prv === true ? common.fullPrivateDir : common.fullPublicDir, dirname)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    return dirPath
  }

  getFilePath(filename: string, dirname: string, prv = false) {
    if (this.common.enableCOS) {
      return `${this.common.proxyDomain}/${dirname}`
    }
    const dirPath = this.getDir(dirname, prv)
    return `${dirPath}/${filename}`
  }

  getCosPrivateFile(filename: string, dirname: string, output: string) {
    return this.bucketService.getPrivateFile(filename, dirname, output)
  }

  async upload(file: LocalUploadFile, userId: string, dirname: string, quoteId?: string, prv = false) {
    try {
      const md5 = await this.calculateFileStats(file.path).catch(err => {
        throw new Error('计算文件md5失败')
      })
      if(!file.size) {
        file.size = fs.statSync(file.path).size
      }
      const uploadfile = await this.filesRepository.findOneBy({ md5, userId })
      if (uploadfile) {
        console.log('用户上传的文件已存在，直接返回文件路径!')
        return this.getResponsePath(uploadfile.name, dirname)
      }
      const filepath = await this.save(file, dirname, prv).catch(err => {
        throw new Error('保存文件失败')
      })
      const upload = new UploadFile()
      upload.name = basename(filepath)
      upload.dirname = dirname
      upload.path = filepath
      upload.userId = userId
      upload.mimetype = file.mimetype
      upload.md5 = md5
      upload.size = file.size
      upload.quote = quoteId ? [quoteId] : []
      await this.filesRepository.save(upload)
      return this.getResponsePath(upload.name, dirname)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  save(file: LocalUploadFile, dirname: string, prv = false) {
    return new Promise<string>(async (resolve, reject) => {
      if (this.common.enableCOS) {
        this.bucketService
          .uploadFile(file, dirname, prv)
          .then(res => {
            const url = this.common.proxyDomain + '/' + dirname + '/' + basename(file.path)
            fs.unlinkSync(file.path)
            // console.log('cos url:', url)
            resolve(url)
          })
          .catch(err => {
            reject(err)
          })
      } else {
        const targetPath = this.createLocalFilePath(path.basename(file.path), dirname)
        // 移动文件
        fs.rename(file.path, targetPath, err => {
          if (err) {
            reject(err)
          } else {
            resolve(targetPath)
          }
        })
      }
    })
  }

  getResponsePath(filename: string, dirname: string) {
    return `${this.common.enableCOS ? this.common.proxyDomain : this.common.serverDomain}${this.common.staticPrefix}/${dirname}/${filename}`
  }

  // getRealPath(filename: string, dirname: string, prv = false) {
  //   if(this.common.enableCOS) {
  //     return `${prv ? this.common.privateProxyDomain : this.common.proxyDomain}/${dirname}/${filename}`
  //   } else {
  //     return `${prv ? this.common.fullPrivateDir : this.common.fullPublicDir}/${dirname}/${filename}`
  //   }
  // }

  // saveImage(args: { sourcePath: string; extname: string; dirname: string }, userId: string) {
  //   // console.log('saveImage')
  //   const { sourcePath, extname, dirname } = args
  //   // console.log(args)
  //   return new Promise<string>(async (resolve, reject) => {
  //     const { size, md5 } = await this.calculateFileStats(sourcePath)
  //     // console.log({ size, md5 })
  //     const file = await this.filesRepository.findOneBy({ md5, size, userId })
  //     if (file) {
  //       const isExists = fs.existsSync(file.path)
  //       if (isExists) {
  //         console.log('用户上传的图片已存在，直接返回图片路径!')
  //         resolve(file.path)
  //         return
  //       }
  //     }

  //     const extWithoutDot = extname.charAt(0) === '.' ? extname.slice(1) : extname
  //     const filename = `${randomstring.generate(3)}${new Date().getTime()}.${extWithoutDot}`
  //     const filepath = this.getFilePath(dirname, filename)
  //     console.log(filepath)
  //     const targetDir = path.dirname(filepath)
  //     if (!fs.existsSync(targetDir)) {
  //       fs.mkdirSync(targetDir, { recursive: true })
  //     }

  //     // 移动文件
  //     fs.rename(sourcePath, filepath, err => {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         // 这里可以异步处理
  //         this.filesRepository.save({
  //           userId,
  //           name: filename,
  //           extname,
  //           type: 'json',
  //           path: filepath,
  //           size,
  //           md5
  //         })

  //         resolve(filepath)
  //       }
  //     })
  //   })
  // }

  // saveAudio(args: { sourcePath: string; extname: string; dirname: string }, userId: string) {
  //   const { sourcePath, extname, dirname } = args

  //   return new Promise<string>(async (resolve, reject) => {
  //     const { size, md5 } = await this.calculateFileStats(sourcePath)
  //     // console.log({ size, md5 })
  //     const file = await this.filesRepository.findOneBy({ md5, size, userId })
  //     if (file) {
  //       const isExists = fs.existsSync(file.path)
  //       if (isExists) {
  //         console.log('用户上传的音频已存在，直接返回音频文件路径!')
  //         resolve(file.path)
  //         return
  //       }
  //     }

  //     const extWithoutDot = extname.charAt(0) === '.' ? extname.slice(1) : extname
  //     const filename = `${randomstring.generate(3)}${new Date().getTime()}.${extWithoutDot}`
  //     const filepath = this.getFilePath(dirname, filename)

  //     const targetDir = path.dirname(filepath)
  //     if (!fs.existsSync(targetDir)) {
  //       fs.mkdirSync(targetDir, { recursive: true })
  //     }

  //     // 移动文件
  //     fs.rename(sourcePath, filepath, err => {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         // 这里可以异步处理
  //         this.filesRepository.save({
  //           userId,
  //           name: filename,
  //           extname,
  //           type: 'json',
  //           path: filepath,
  //           size,
  //           md5
  //         })

  //         resolve(filepath)
  //       }
  //     })
  //   })
  // }

  // saveJSON(args: { sourcePath: string; extname: string; dirname: string }, userId: string) {
  //   const { sourcePath, extname, dirname } = args

  //   return new Promise<string>(async (resolve, reject) => {
  //     const { size, md5 } = await this.calculateFileStats(sourcePath)
  //     // console.log({ size, md5 })
  //     const file = await this.filesRepository.findOneBy({ md5, size, userId })
  //     if (file) {
  //       const isExists = fs.existsSync(file.path)
  //       if (isExists) {
  //         console.log('用户上传的文件已存在，直接返回文件路径!')
  //         resolve(file.path)
  //         return
  //       }
  //     }

  //     const extWithoutDot = extname.charAt(0) === '.' ? extname.slice(1) : extname
  //     const filename = `${randomstring.generate(3)}${new Date().getTime()}.${extWithoutDot}`
  //     const filepath = this.getFilePath(
  //       dirname,
  //       filename,

  //       true
  //     )
  //     console.log(filepath)
  //     const targetDir = path.dirname(filepath)
  //     if (!fs.existsSync(targetDir)) {
  //       fs.mkdirSync(targetDir, { recursive: true })
  //     }

  //     // 移动文件
  //     fs.rename(sourcePath, filepath, err => {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         // 这里可以异步处理
  //         this.filesRepository.save({
  //           userId,
  //           name: filename,
  //           extname,
  //           type: 'json',
  //           path: filepath,
  //           size,
  //           md5
  //         })

  //         resolve(filepath)
  //       }
  //     })
  //   })
  // }

  async calculateFileStats(filePath: string) {
    return new Promise<string>((resolve, reject) => {
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
