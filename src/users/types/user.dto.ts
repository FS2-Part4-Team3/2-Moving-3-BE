import { ProviderInfo } from '#auth/types/provider.types.js';
import { ModelBase, modelBaseKeys, sensitiveKeys } from '#types/common.types.js';
import { IUser, UserEntity } from '#users/types/user.types.js';
import { OmitType, PartialType } from '@nestjs/swagger';

const omitKeys = [...modelBaseKeys, ...sensitiveKeys] as (keyof UserEntity)[];
export class UserPatchDTO extends PartialType(OmitType(UserEntity, omitKeys)) {}
export interface UserUpdateDTO extends Partial<Omit<IUser, keyof (ModelBase & ProviderInfo)>> {}
