import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from './usuarios/usuario.module';
import { DietaModule } from './dietas/dieta.module';
import { RestauranteModule } from './restaurante/restaurante.module';
import { PedidoModule } from './pedidos/pedido.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsuarioModule,
    DietaModule,
    RestauranteModule,
    PedidoModule,
  ],
})
export class AppModule {}