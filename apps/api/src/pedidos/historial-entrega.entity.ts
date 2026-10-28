import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { PedidoProgramado } from './pedido-programado.entity';

@Entity('historial_entregas')
export class HistorialEntrega {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pedidoProgramadoId: string;

  @ManyToOne(() => PedidoProgramado, (pedido) => pedido.historialEntregas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pedidoProgramadoId' })
  pedidoProgramado: PedidoProgramado;

  @Column()
  estadoFinal: string;

  @Column()
  pinUtilizado: string;

  @CreateDateColumn()
  entregadoAt: Date;
}