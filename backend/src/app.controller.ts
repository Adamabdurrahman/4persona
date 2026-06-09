import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      message: '4Persona Vundiego API is running 🚀',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    };
  }
}
