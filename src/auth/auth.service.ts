import { SignInDTO } from '#auth/auth.types.js';
import { IAuthService } from '#auth/interfaces/auth.service.interface.js';
import { UserInputDTO } from '#users/user.types.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService implements IAuthService {
  constructor() {}

  async getMe() {}

  async createUser(body: UserInputDTO) {}

  async signIn(body: SignInDTO) {}

  async getNewToken() {}
}
