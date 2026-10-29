import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PedidoProgramado } from './pedido-programado.entity';
import { HistorialEntrega } from './historial-entrega.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(PedidoProgramado)
    private pedidoRepository: Repository<PedidoProgramado>,
    @InjectRepository(HistorialEntrega)
    private historialRepository: Repository<HistorialEntrega>,
  ) {}

  findAllPedidos() {
    return this.pedidoRepository.find({ relations: ['usuario', 'restaurante', 'dieta'] } as any);
  }

  createPedido(data: Partial<PedidoProgramado>) {
    const pedido = this.pedidoRepository.create(data);
    return this.pedidoRepository.save(pedido);
  }

  findAllHistorial() {
    return this.historialRepository.find({ relations: ['pedidoProgramado'] } as any);
  }

  createHistorial(data: Partial<HistorialEntrega>) {
    const historial = this.historialRepository.create(data);
    return this.historialRepository.save(historial);
  }
}