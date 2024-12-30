import { NotFoundException } from '#exceptions/http.exception.js';
import { ModelBase } from '#types/common.types.js';

export default function assertExist<T extends ModelBase>(target: T | null): asserts target is T {
  if (target !== null) return;

  throw new NotFoundException();
}
