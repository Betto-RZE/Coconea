import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PedidoProgramado } from '../pedidos/pedido-programado.entity';

@Entity('dietas')
export class Dieta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column({ type: 'int' })
  caloriasObjetivo: number;

  @Column({ type: 'float' })
  proteinasGr: number;

  @Column({ type: 'float' })
  carbohidratosGr: number;

  @Column({ type: 'float' })
  grasasGr: number;

  @Column('simple-array', { nullable: true })
  alergenosExcluidos: string[];

  @OneToMany(() => PedidoProgramado, (pedido) => pedido.dieta)
  pedidosProgramados: PedidoProgramado[];
}