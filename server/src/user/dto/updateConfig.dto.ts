import { UserConfig } from "../user.entity";
import { IsBoolean, IsEmpty, IsMongoId, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export class UpdateConfigDto implements UserConfig {

  @IsBoolean() @IsNotEmpty() autoDisplay: boolean;
  
}