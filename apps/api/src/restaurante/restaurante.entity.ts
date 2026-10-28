import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { PedidoProgramado } from '../pedidos/pedido-programado.entity';

@Entity('restaurantes')
export class Restaurante {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column()
  usuarioId: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.restaurantes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column({ default: 'ACTIVO' })
  estado: string;

  @OneToMany(() => PedidoProgramado, (pedido) => pedido.restaurante)
  pedidosProgramados: PedidoProgramado[];
}