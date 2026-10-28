import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dieta } from './dieta.entity';
import { DietaService } from './dieta.service';
import { DietaController } from './dieta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dieta])],
  controllers: [DietaController],
  providers: [DietaService],
  exports: [DietaService],
})
export class DietaModule {}