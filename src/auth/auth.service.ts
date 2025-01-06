import { AuthUserAlreadyExistException, AuthWrongCredentialException } from '#auth/auth.exception.js';
import { SignInDTO } from '#auth/auth.types.js';
import { IAuthService } from '#auth/interfaces/auth.service.interface.js';
import { JwtGenerateService } from '#auth/jwt-generate.service.js';
import { IStorage } from '#types/common.types.js';
import { UserNotFoundException } from '#users/user.exception.js';
import { UserRepository } from '#users/user.repository.js';
import { UserInputDTO } from '#users/user.types.js';
import filterSensitiveData from '#utils/filterSensitiveData.js';
import hashingPassword from '#utils/hashingPassword.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtGenerateService: JwtGenerateService,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getMe() {
    const { userId } = this.als.getStore();
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    return user;
  }

  async createUser(body: UserInputDTO) {
    const data = body;
    const userExist = await this.userRepository.findByEmail(data.email);
    if (userExist) throw new AuthUserAlreadyExistException();

    const user = await this.userRepository.create(data);
    const accessToken = await this.jwtGenerateService.generateAccessToken({ userId: user.id });

    return { user: filterSensitiveData(user), accessToken };
  }

  async signIn(body: SignInDTO) {
    const { email, password } = body;
    const user = await this.userRepository.findByEmail(email);
    const hashed = hashingPassword(password, user.salt);
    if (!user) throw new AuthWrongCredentialException();
    if (user.password !== hashed) throw new AuthWrongCredentialException();

    const accessToken = await this.jwtGenerateService.generateAccessToken({ userId: user.id });

    return { user: filterSensitiveData(user), accessToken };
  }

  async getNewToken() {}
}
