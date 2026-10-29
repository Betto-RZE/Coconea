import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoProgramado } from './pedido-programado.entity';
import { HistorialEntrega } from './historial-entrega.entity';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PedidoProgramado, HistorialEntrega])],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService],
})
export class PedidoModule {}