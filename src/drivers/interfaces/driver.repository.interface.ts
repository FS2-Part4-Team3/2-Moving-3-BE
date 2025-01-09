import { DriverInputDTO } from '#drivers/driver.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IDriverRepository {
  count: () => Promise<number>;
  findMany: (options: FindOptions) => void;
  findById: (id: string) => void;
  create: (data: DriverInputDTO) => void;
  update: (id: string, data: Partial<DriverInputDTO>) => void;
  delete: (id: string) => void;
}
