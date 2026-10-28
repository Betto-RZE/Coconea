import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Restaurante } from '../restaurante/restaurante.entity';
import { PedidoProgramado } from '../pedidos/pedido-programado.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: 'CUSTOMER' })
  rol: string; // CUSTOMER, RESTAURANT, DELIVERY, ADMIN

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  direccion: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Restaurante, (restaurante) => restaurante.usuario)
  restaurantes: Restaurante[];

  @OneToMany(() => PedidoProgramado, (pedido) => pedido.usuario)
  pedidosProgramados: PedidoProgramado[];
}