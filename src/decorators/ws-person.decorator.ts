import { InternalServerErrorException } from '#exceptions/http.exception.js';
import { UserType } from '#types/common.types.js';
import { CustomSocket } from '#types/socket.type.js';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WSPerson = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const client: CustomSocket = ctx.switchToWs().getClient<CustomSocket>();

  switch (client.type) {
    case UserType.User:
      return client.user;
    case UserType.Driver:
      return client.driver;
    default:
      throw new InternalServerErrorException('소켓 클라이언트에 적절한 유저 타입이 없습니다.');
  }
});
