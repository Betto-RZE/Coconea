import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurante } from './restaurante.entity';

@Injectable()
export class RestauranteService {
  constructor(
    @InjectRepository(Restaurante)
    private restauranteRepository: Repository<Restaurante>,
  ) {}

  findAll() {
    return this.restauranteRepository.find();
  }

  create(data: Partial<Restaurante>) {
    const restaurante = this.restauranteRepository.create(data);
    return this.restauranteRepository.save(restaurante);
  }
}