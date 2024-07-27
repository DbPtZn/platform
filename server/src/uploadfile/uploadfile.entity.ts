import { RemovedEnum } from 'src/enum'
import { User } from 'src/user/user.entity'
import { Entity, ObjectId, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, AfterUpdate, BeforeInsert, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity()
export class UploadFile {
  @PrimaryGeneratedColumn('uuid') id: ObjectId

  @Column('uuid') userId: string
  @ManyToOne(() => User, user => user.files)
  user: User

  @Column('varchar') type: 'image' | 'audio'
  @Column('varchar') name: string
  @Column('varchar') extname: string
  @Column('int') size: number
  @Column('varchar') md5: string
  @Column('varchar') path: string

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
