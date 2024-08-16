import { Article } from 'src/article/article.entity'
import { Authcode } from 'src/authcode/authcode.entity'
import { UploadFile } from 'src/uploadfile/uploadfile.entity'
import { Entity, Column, CreateDateColumn, UpdateDateColumn, AfterUpdate, BeforeInsert, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn } from 'typeorm'
import { Exclude } from 'class-transformer'
import { Album } from 'src/album/album.entity'

export type ReceiverConfig = {
  status: 0 | 1 | 2
  autoParse: boolean
  sizeLimit: number
}

export class UserConfig  {
  autoDisplay: boolean // 是否自动将公开项目设置为展示状态
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') id: string

  @OneToMany(() => Article, article => article.authcode)
  articles: Article[]

  @OneToMany(() => Authcode, authcode => authcode.user)
  authcodes: Authcode[]

  @OneToMany(() => Album, album => album.user)
  albums: Album[]

  @OneToMany(() => UploadFile, file => file.user)
  files: UploadFile[]

  @Column({
    type: 'varchar',
    unique: true,
    length: 24
  })
  UID: string
  
  @Column({
    type: 'varchar',
    unique: true,
    length: 32
  })
  account: string

  @Exclude() 
  @Column({
    type: 'varchar',
    length: 64
  })
  encryptedPassword: string

  @Column({
    type: 'varchar',
    default: ''
  })
  nickname: string

  @Column({
    type: 'varchar',
    default: ''
  })
  avatar: string

  @Column({
    type: 'varchar',
    default: ''
  })
  desc: string

  @Column({
    type: 'simple-json',
    nullable: true
  })
  info: {
    email: string,
    phone: string
  }

  @Column({
    type: 'simple-json',
    nullable: true
  })
  receiverConfig: ReceiverConfig

  @Column({
    type: 'simple-json',
    nullable: true
  })
  config: UserConfig

  @Column({
    type: 'simple-array',
    nullable: true
  })
  albumSequence: string[]

  @Column({
    type: 'boolean',
    default: false
  })
  isPublish: boolean // 是否公开博客

  @CreateDateColumn() createAt: Date
  @UpdateDateColumn() updateAt: Date
  @DeleteDateColumn() deleteAt: Date

  /** 插入实体时设置创建时间 */
  @BeforeInsert()
  createDate() {
    this.createAt = new Date()
  }

  /** 实体更新时自动更新时间 */
  @AfterUpdate()
  updateDate() {
    this.updateAt = new Date()
  }
}
