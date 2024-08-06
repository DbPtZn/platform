import { IsString, Length, IsEmpty } from 'class-validator'

export class UpdateInfoDto {
  // @IsString()
  nickname: string

  // @IsString()
  avatar: string

  // @IsString()
  desc: string
}
