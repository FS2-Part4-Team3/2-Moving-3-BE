import { Driver } from '#drivers/driver.types.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';
import { User } from '#users/user.types.js';

export default function filterSensitiveData<T extends User | Driver>(data: T): FilteredPersonalInfo<T> {
  const { password, salt, refreshToken, ...rest } = data;

  return rest as FilteredPersonalInfo<T>;
}
