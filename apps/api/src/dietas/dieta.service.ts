import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dieta } from './dieta.entity';

@Injectable()
export class DietaService {
  constructor(
    @InjectRepository(Dieta)
    private dietaRepository: Repository<Dieta>,
  ) {}

  findAll() {
    return this.dietaRepository.find();
  }

  create(data: Partial<Dieta>) {
    const dieta = this.dietaRepository.create(data);
    return this.dietaRepository.save(dieta);
  }
}