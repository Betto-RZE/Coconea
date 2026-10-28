import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  findAll() {
    return this.usuarioRepository.find();
  }

  create(data: Partial<Usuario>) {
    const usuario = this.usuarioRepository.create(data);
    return this.usuarioRepository.save(usuario);
  }
}