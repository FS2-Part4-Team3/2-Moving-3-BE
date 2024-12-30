import { IStorage } from '#types/common.types.js';
import { Global, Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Global()
@Module({
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage<IStorage>(),
    },
  ],
  exports: [AsyncLocalStorage],
})
export class StorageModule {}
