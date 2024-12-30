import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Moving')
  .setDescription('3팀 무빙 api')
  .setVersion('1.0')
  .addServer('http://localhost:3000/', 'Local environment')
  .build();

export default swaggerConfig;
