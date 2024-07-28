import { Article } from 'src/article/article.entity'
import { User } from 'src/user/user.entity'
import { Entity, Column, CreateDateColumn, UpdateDateColumn, AfterUpdate, BeforeInsert, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'

@Entity()
export class Authcode {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column('uuid') userId: string
  @ManyToOne(() => User, user => user.authcodes)
  user: User

  @OneToMany(() => Article, article => article.authcode)
  articles: Article[]

  @Column('varchar') name: string
  @Column('varchar') code: string
  @Column('varchar') desc: string
  
  @Column({
    type: 'boolean',
    default: false
  })
  disabled: boolean

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
