import { Controller, Get, Post, Body } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { Restaurante } from './restaurante.entity';

@Controller('restaurantes')
export class RestauranteController {
  constructor(private readonly restauranteService: RestauranteService) {}

  @Get()
  findAll() {
    return this.restauranteService.findAll();
  }

  @Post()
  create(@Body() body: Partial<Restaurante>) {
    return this.restauranteService.create(body);
  }
}