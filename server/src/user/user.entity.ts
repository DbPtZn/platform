import { Article } from 'src/article/article.entity'
import { Authcode } from 'src/authcode/authcode.entity'
import { Column as Col } from 'src/column/column.entity'
import { RemovedEnum } from 'src/enum'
import { UploadFile } from 'src/uploadfile/uploadfile.entity'
import { Entity, ObjectId, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, AfterUpdate, BeforeInsert, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Exclude } from 'class-transformer'

export type ReceiverConfig = {
  status: 0 | 1 | 2
  autoParse: boolean
  sizeLimit: number
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') id: string

  @OneToMany(() => Article, article => article.authcode)
  articles: Article[]

  @OneToMany(() => Authcode, authcode => authcode.user)
  authcodes: Authcode[]

  @OneToMany(() => Col, col => col.user)
  columns: Col[]

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
    type: 'simple-array',
    nullable: true
  })
  columnSequence: string[]

  @CreateDateColumn() createAt: Date
  @UpdateDateColumn() updateAt: Date

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
