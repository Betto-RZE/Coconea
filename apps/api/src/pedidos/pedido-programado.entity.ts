import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Restaurante } from '../restaurante/restaurante.entity';
import { Dieta } from '../dietas/dieta.entity';
import { HistorialEntrega } from './historial-entrega.entity';

@Entity('pedidos_programados')
export class PedidoProgramado {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  usuarioId: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.pedidosProgramados, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column()
  restauranteId: string;

  @ManyToOne(() => Restaurante, (restaurante) => restaurante.pedidosProgramados, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restauranteId' })
  restaurante: Restaurante;

  @Column()
  dietaId: string;

  @ManyToOne(() => Dieta, (dieta) => dieta.pedidosProgramados, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dietaId' })
  dieta: Dieta;

  @Column({ type: 'datetime' })
  fechaEntrega: Date;

  @Column({ default: 'PENDIENTE' })
  estado: string; // PENDIENTE, CONFIRMADO, EN_PREPARACION, LISTO_PARA_REPARTIDOR, EN_RUTA, ENTREGADO, CANCELADO

  @Column()
  pinConfirmacion: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => HistorialEntrega, (historial) => historial.pedidoProgramado)
  historialEntregas: HistorialEntrega[];
}