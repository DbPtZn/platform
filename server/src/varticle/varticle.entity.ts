import { RemovedEnum } from 'src/enum'
import { Entity, Column, CreateDateColumn, UpdateDateColumn, AfterUpdate, BeforeInsert, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Column as Col } from 'src/column/column.entity'
import { Authcode } from 'src/authcode/authcode.entity'
import { User } from 'src/user/user.entity'
@Entity()
export class VArticle {
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

  @Column('uuid') userId: string
  @ManyToOne(() => User, user => user.articles)
  user: User

  @Column('uuid') authcodeId: string
  @ManyToOne(() => Authcode, code => code.articles)
  authcode: Authcode
  
  @Column('uuid') columnId: string
  @ManyToOne(() => Col, col => col.articles)
  column: Col

  @Column('varchar') type: 'note' | 'course' | 'other'
  @Column('boolean') isParsed: boolean
  @Column('varchar') msg: string
  @Column('varchar') editorVersion: string
  @Column('varchar') cover: string
  @Column('varchar') title: string
  @Column('varchar') content: string
  @Column('varchar') abbrev: string
  @Column('varchar') audio: string

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

  @Column('boolean') isPublish: boolean
  @Column({
    type: 'varchar',
    default: RemovedEnum.NEVER
  })
  removed: RemovedEnum

  @Column({
    type: 'simple-json',
    nullable: true
  })
  author: {
    penname?: string
    avatar?: string
    email?: string
    blog?: string
  }

  @Column({
    type: 'simple-json',
    nullable: true
  })
  detail: {
    wordage?: number
    duration?: number
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
    this.isPublish = false
  }

  /** 实体更新时自动更新时间 */
  @AfterUpdate()
  updateDate() {
    this.updateAt = new Date()
  }
}
