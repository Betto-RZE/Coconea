import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Verificar estado del servicio' })
  @ApiResponse({ status: 200, description: 'Servicio en funcionamiento' })
  getHealth() {
    return {
      status: 'ok',
      service: 'Coconea API',
      apiVersion: 'v1',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
