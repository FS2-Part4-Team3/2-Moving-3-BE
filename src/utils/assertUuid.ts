import { UuidException } from '#exceptions/common.exception.js';
import { validate } from 'uuid';

export default function assertUuid(target: string) {
  const isUuid = validate(target);
  if (!isUuid) throw new UuidException();
}
