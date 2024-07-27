import { Article } from 'src/article/article.entity'
import { RemovedEnum } from 'src/enum'
import { User } from 'src/user/user.entity'
import { Entity, ObjectId, Column as Col, CreateDateColumn, UpdateDateColumn, AfterUpdate, BeforeInsert, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'

@Entity()
export class Column {
  @PrimaryGeneratedColumn('uuid') id: ObjectId

  @Col('uuid') userId: string
  @ManyToOne(() => User, user => user.columns)
  user: User

  @OneToMany(() => Article, article => article.column)
  articles: Article[]

  @Col('varchar') UID: string
  @Col('varchar') name: string
  @Col('varchar') cover: string
  @Col('varchar') desc: string
  @Col() isPublish: boolean
  @Col({
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
