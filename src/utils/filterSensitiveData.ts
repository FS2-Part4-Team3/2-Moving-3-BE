import { FilteredUserOutputDTO } from '#auth/auth.types.js';
import { User } from '@prisma/client';

export default function filterSensitiveData(data: User): FilteredUserOutputDTO {
  const { password, salt, refreshToken, ...rest } = data;

  return rest;
}
