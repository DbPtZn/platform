import { RemovedEnum } from 'src/enum'
import { Entity, Column, CreateDateColumn, UpdateDateColumn, AfterUpdate, BeforeInsert, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'
import { Authcode } from 'src/authcode/authcode.entity'
import { User } from 'src/user/user.entity'
import { VArticle } from 'src/varticle/varticle.entity'
import { Album } from 'src/album/album.entity'
@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid') id: string
  
  @Column('varchar') UID: string

  @Column({
    type: 'uuid',
    nullable: true
  })
  editionId: string // 版本 id

  @Column({
    type: 'uuid',
    nullable: true
  })
  fromEditionId: string // 来源版本 id

  @OneToMany(() => VArticle, varticle => varticle.primary)
  varticles: VArticle[]

  @Column('uuid') userId: string
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
    type: 'boolean',
    default: false
  })
  isParsed: boolean

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
  promoterSequence: string[]

  @Column({
    type: 'simple-array',
    nullable: true
  })
  keyframeSequence: number[]

  @Column({
    type: 'simple-array',
    nullable: true
  })

  @Column({
    type: 'simple-array',
    nullable: true
  })
  subtitleSequence: string[]
  @Column({
    type: 'simple-array',
    nullable: true
  })
  subtitleKeyframeSequence: number[]

  @Column({
    type: 'simple-array',
    nullable: true
  })
  tags: string[]

  @Column({
    type: 'boolean',
    default: false
  })
  isPublished: boolean

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
  penname: string // 笔名 便利查询

  @Column({
    type: 'varchar',
    default: ''
  })
  email: string // 邮箱 便利查询

  @Column({
    type: 'varchar',
    default: ''
  })
  avatar: string

  // 作者的其它信息
  @Column({
    type: 'simple-json',
    nullable: true
  })
  author: {
    blog?: string
  }

  @Column({
    type: 'int',
    default: 0
  })
  wordage: number

  @Column({
    type: 'float',
    default: 0
  })
  duration: number

  // 作品的其它信息
  @Column({
    type: 'simple-json',
    nullable: true
  })
  detail: {
    fileSize?: number
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
