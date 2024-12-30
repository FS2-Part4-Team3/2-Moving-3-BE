import { SwaggerService } from '#swagger/swagger.service.js';
import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class SwaggerController {
  constructor(private readonly swaggerService: SwaggerService) {}

  @Get('api-json')
  @ApiExcludeEndpoint()
  getSwaggerJson() {
    return this.swaggerService.getSwaggerJson();
  }

  @Get('api-save')
  @ApiExcludeEndpoint()
  saveSwaggerJson() {
    return this.swaggerService.saveSwaggerJson();
  }
}
