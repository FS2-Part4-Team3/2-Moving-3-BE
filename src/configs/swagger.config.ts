import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder().setTitle('Moving').setDescription('3팀 무빙 api').setVersion('1.0').build();

export default swaggerConfig;
