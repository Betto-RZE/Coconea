import { Controller, Get, Post, Body } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoProgramado } from './pedido-programado.entity';
import { HistorialEntrega } from './historial-entrega.entity';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Get()
  findAllPedidos() {
    return this.pedidoService.findAllPedidos();
  }

  @Post()
  createPedido(@Body() body: Partial<PedidoProgramado>) {
    return this.pedidoService.createPedido(body);
  }

  @Get('historial')
  findAllHistorial() {
    return this.pedidoService.findAllHistorial();
  }

  @Post('historial')
  createHistorial(@Body() body: Partial<HistorialEntrega>) {
    return this.pedidoService.createHistorial(body);
  }
}