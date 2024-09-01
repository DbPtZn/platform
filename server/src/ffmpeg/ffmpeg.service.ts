import { Injectable } from '@nestjs/common'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import FfmpegModule from '@ffmpeg-installer/ffmpeg'
import { exec } from 'node:child_process'

@Injectable()
export class FfmpegService {
  constructor() {
    ffmpeg.setFfmpegPath(FfmpegModule.path)
    // 测试代码
    // const oggpath = `C:/Users/admin/Desktop/platform/server/assets/public/34DAZ-1724953340668.ogg`
    // const mp3path = `C:/Users/admin/Desktop/platform/server/assets/public/34DAZ-1724953340668.wav`
    // this.convertToMp3(oggpath, mp3path).then(target => {
    //   this.calculateDuration(oggpath).then(duration => {
    //     console.log('ogg duration', duration)
    //   })
    //   this.calculateDuration(mp3path).then(duration => {
    //     console.log('wav duration', duration)
    //   })
    // })
  }

  /** 将音频文件转换成 mp3 格式 (转 mp3 格式会出现输出音频时长不一致的问题) */
  async convertToMp3(source: string, target: string) {
    return new Promise<string>((resolve, reject) => {
      ffmpeg(source)
        .toFormat('mp3')
        .on('error', function (err) {
          console.log('An error occurred: ' + err.message)
          reject(err)
        })
        .on('end', function () {
          resolve(target)
        })
        .save(target)
    })
  }

  /** 将音频文件转换成 m4a 格式 (转 m4a 格式会出现输出音频时长不一致的问题) */
  async convertToM4a(source: string, target: string) {
    return new Promise<string>((resolve, reject) => {
      ffmpeg(source)
        .toFormat('m4a')
        .save(target)
        .on('error', function (err) {
          console.log('An error occurred: ' + err.message)
          reject(err)
        })
        .on('end', function () {
          // console.log('Processing finished successfully')
          resolve(target)
        })
    })
  }

  /** 计算音频时长 */
  calculateDuration(filepath: string) {
    return new Promise<number>((resolve, reject) => {
      // 1.ffprobe: 这是一个来自 FFmpeg 软件包的工具，用于分析和检查多媒体文件的属性。
      // 2.-v error: 这是 ffprobe 的选项，它指定了输出的日志级别。在这里，error 级别意味着只输出错误信息。
      // 3.-show_entries format=duration: 这个选项告诉 ffprobe 显示关于视频格式的信息，并且只包含持续时间（duration）的信息。
      // 4.-of default=noprint_wrappers=1:nokey=1: 这是输出格式选项，它定义了输出的格式。在这里，它指定了输出的格式为默认格式，但是禁用了包装器，同时禁用了键
      const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filepath}"`
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`执行 FFmpeg 命令时出错：${error.message}`)
          reject(error)
          return
        }
        if (stderr) {
          console.error(`FFmpeg 命令输出了错误信息：${stderr}`)
          reject(stderr)
          return
        }
        let durationInSeconds = parseFloat(stdout.trim())
        // 非数字或 NaNs 的情况
        if (typeof durationInSeconds !== 'number' || isNaN(durationInSeconds)) {
          durationInSeconds = 0
        }
        console.log('音频时长:', durationInSeconds, '秒')
        resolve(durationInSeconds)
      })
    })
  }
}
