import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthcodeService } from './authcode.service';
import { CreateAuthcodeDto } from './dto/create-authcode.dto';
// import { UpdateAuthcodeDto } from './dto/update-authcode.dto';

@Controller('authcode')
export class AuthcodeController {
  constructor(private readonly authcodeService: AuthcodeService) {}

}
