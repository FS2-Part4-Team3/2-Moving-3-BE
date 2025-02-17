import { Prisma } from '@prisma/client';

export function prismaSoftDeleteMiddleware(): Prisma.Middleware {
  return async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
    if (['findMany', 'findFirst', 'findUnique', 'count'].includes(params.action)) {
      params.args ??= {};
      params.args.where ??= {};

      if (!params.args.forceFind) {
        params.args.where.deletedAt = null;
      }

      delete params.args.forceFind;
    }

    if (['delete', 'deleteMany'].includes(params.action)) {
      const args = params.args as any;

      if (!args.forceDelete) {
        params.action = params.action === 'delete' ? 'update' : 'updateMany';

        params.args.data = {
          ...params.args.data,
          deletedAt: new Date(),
        };
      }

      delete args.forceDelete;
    }
    // if (params.action === 'delete' && !params.args?.forceDelete) {
    //   params.action = 'update';
    //   params.args.data = {
    //     ...params.args.data,
    //     deletedAt: new Date(),
    //   };
    // }

    // if (params.action === 'deleteMany' && !params.args?.forceDelete) {
    //   params.action = 'updateMany';
    //   params.args.data = {
    //     ...params.args.data,
    //     deletedAt: new Date(),
    //   };
    // }

    return next(params);
  };
}
