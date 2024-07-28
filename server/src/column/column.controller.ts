import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  
}
