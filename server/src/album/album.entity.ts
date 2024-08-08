import { Article } from 'src/article/article.entity'
import { RemovedEnum } from 'src/enum'
import { User } from 'src/user/user.entity'
import { Entity, Column, CreateDateColumn, UpdateDateColumn, AfterUpdate, BeforeInsert, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column('uuid') userId: string
  
  @ManyToOne(() => User, user => user.albums)
  user: User

  @OneToMany(() => Article, article => article.album)
  articles: Article[]

  @Column({
    type: 'varchar',
  })
  UID: string
  @Column({
    type: 'varchar',
    default: ''
  })
  name: string
  @Column({
    type: 'varchar',
    default: ''
  })
  cover: string
  @Column({
    type: 'varchar',
    default: ''
  })
  desc: string

  @Column({
    type: 'boolean',
    default: false
  })
  isDisplayed: boolean

  @Column({
    type: 'varchar',
    default: RemovedEnum.NEVER
  })
  removed: RemovedEnum

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
