import { Controller, Get, Post, Body } from '@nestjs/common';
import { DietaService } from './dieta.service';
import { Dieta } from './dieta.entity';

@Controller('dietas')
export class DietaController {
  constructor(private readonly dietaService: DietaService) {}

  @Get()
  findAll() {
    return this.dietaService.findAll();
  }

  @Post()
  create(@Body() body: Partial<Dieta>) {
    return this.dietaService.create(body);
  }
}