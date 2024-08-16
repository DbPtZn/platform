import { RemovedEnum } from 'src/enum'
import { Entity, Column, CreateDateColumn, UpdateDateColumn, AfterUpdate, BeforeInsert, PrimaryGeneratedColumn, ManyToOne, OneToMany, DeleteDateColumn } from 'typeorm'
import { Authcode } from 'src/authcode/authcode.entity'
import { User } from 'src/user/user.entity'
import { Album } from 'src/album/album.entity'

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column('uuid') userId: string

  @Column('varchar') UID: string

  // 可以通过 id 访问，也可以通过 agentId 访问
  @Column('uuid') agentId: string // 代理 id, 通过该 id 访问公开文章

  @Column('uuid') editionId: string // 版号 （ 用于匹配相同版号的文章，也用于投稿时进行版本匹配，有重码的可能，应结合 userId 来锁定同一个版号）

  @Column({
    type: 'boolean',
    default: false
  })
  isMultiEdition: boolean // 是否多版本（用来手动标记该项目是否有多个版本，节省查询开销）

  @Column({
    type: 'boolean',
    default: false
  })
  isCurrent: boolean // 当前版本（结合 agentId 查询，标记当前使用的版本，需要保证所有版本中有且仅有一个作为当前版本）

  @Column({
    type: 'boolean',
    default: false
  })
  isParsed: boolean // 是否完成解析

  @ManyToOne(() => User, user => user.articles)
  user: User

  @ManyToOne(() => Authcode, code => code.articles)
  authcode: Authcode
  
  @Column({
    type: 'uuid',
    nullable: true
  })
  albumId: string

  @ManyToOne(() => Album, album => album.articles)
  album: Album

  @Column({
    type: 'varchar',
    default: 'other'
  })
  type: 'note' | 'course' | 'other'

  @Column({
    type: 'varchar',
    default: ''
  })
  msg: string

  @Column({
    type: 'text',
    nullable: true
  })
  refuseMsg: string // 拒稿理由

  @Column({
    type: 'varchar',
    default: ''
  })
  editorVersion: string

  @Column({
    type: 'varchar',
    default: ''
  })
  cover: string

  @Column({
    type: 'varchar',
    default: ''
  })
  title: string

  @Column({
    type: 'varchar',
    default: '',
  })
  unparsedFile: string // 未解析文件

  @Column({
    type: 'text',
  })
  content: string

  @Column({
    type: 'varchar',
    default: ''
  })
  abbrev: string

  @Column({
    type: 'varchar',
    default: ''
  })
  audio: string

  @Column({
    type: 'simple-array',
    nullable: true
  })
  promoterSequence: string[]  // 启动子序列

  @Column({
    type: 'simple-array',
    nullable: true
  })
  keyframeSequence: number[]  // 关键帧序列

  @Column({
    type: 'simple-array',
    nullable: true
  })
  subtitleSequence: string[]  // 字幕序列

  @Column({
    type: 'simple-array',
    nullable: true
  })
  subtitleKeyframeSequence: number[] // 字幕关键帧序列

  @Column({
    type: 'simple-array',
    nullable: true
  })
  tags: string[] // 标签

  @Column({
    type: 'boolean',
    default: false
  })
  isPublished: boolean // 是否公开发布 （是否能通过项目链接被所有人公开访问）

  @Column({
    type: 'boolean',
    default: true
  })
  isDisplayed: boolean // 是否展示（是否在博客编辑主页进行展示，允许某些公开的文章，可以不展示）

  @Column({
    type: 'varchar',
    default: RemovedEnum.NEVER
  })
  removed: RemovedEnum

  @Column({
    type: 'varchar',
    default: '佚名'
  })
  penname: string // 笔名

  @Column({
    type: 'varchar',
    default: ''
  })
  email: string // 邮箱

  @Column({
    type: 'varchar',
    default: ''
  })
  avatar: string // 头像

  // 作者的其它信息
  @Column({
    type: 'simple-json',
    nullable: true
  })
  author: {
    blog?: string // 个人博客
  }

  @Column({
    type: 'int',
    default: 0
  })
  wordage: number //  字数

  @Column({
    type: 'float',
    default: 0
  })
  duration: number // 时长

  // 作品的其它信息
  @Column({
    type: 'simple-json',
    nullable: true
  })
  detail: {
    fileSize?: number // 文件大小
  }

  @Column({
    type: 'simple-json',
    nullable: true
  })
  meta: {
    views: number
    likes: number
    collections: number
    comments: number
  }

  @CreateDateColumn() createAt: Date
  @UpdateDateColumn() updateAt: Date
  @DeleteDateColumn() deleteAt: Date

  /** 插入实体时设置创建时间 */
  @BeforeInsert()
  createDate() {
    this.createAt = new Date()
    this.updateAt = new Date()
    this.isPublished = false
    this.isDisplayed = true
  }

  /** 实体更新时自动更新时间 */
  @AfterUpdate()
  updateDate() {
    this.updateAt = new Date()
  }
}
