import {
  AuthInvalidRefreshTokenException,
  AuthUserAlreadyExistException,
  AuthWrongCredentialException,
} from '#auth/auth.exception.js';
import { GoogleAuthType, GoogleCreateDTO, SignInDTO, SignUpDTO } from '#auth/auth.types.js';
import { IAuthService } from '#auth/interfaces/auth.service.interface.js';
import { JwtGenerateService } from '#auth/jwt-generate.service.js';
import { DriverRepository } from '#drivers/driver.repository.js';
import { InvalidUserTypeException } from '#exceptions/common.exception.js';
import { UnauthorizedException } from '#exceptions/http.exception.js';
import { IStorage, UserType } from '#types/common.types.js';
import { UserRepository } from '#users/user.repository.js';
import compareExp from '#utils/compareExp.js';
import filterSensitiveData from '#utils/filterSensitiveData.js';
import hashingPassword from '#utils/hashingPassword.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly driverRepository: DriverRepository,
    private readonly jwtGenerateService: JwtGenerateService,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getMe() {
    const storage = this.als.getStore();

    const person = storage.type === UserType.User ? storage.user : storage.driver;

    return filterSensitiveData(person);
  }

  async createPerson(body: SignUpDTO, type: UserType) {
    const data = body;
    const repo = type === UserType.User ? this.userRepository : this.driverRepository;

    const targetExist = await repo.findByEmail(data.email);
    if (targetExist) {
      throw new AuthUserAlreadyExistException();
    }

    const person = await repo.createBySignUp(data);
    const accessToken = await this.jwtGenerateService.generateAccessToken({ id: person.id, type });
    const refreshToken = await this.jwtGenerateService.generateRefreshToken({ id: person.id, type });
    person.type = type;

    return { person: filterSensitiveData(person), accessToken, refreshToken };
  }

  async signIn(body: SignInDTO, type: UserType) {
    const { email, password } = body;
    const repo = type === UserType.User ? this.userRepository : this.driverRepository;

    const target = await repo.findByEmail(email);
    if (!target) {
      throw new AuthWrongCredentialException();
    }
    const hashed = hashingPassword(password, target.salt);
    if (target.password !== hashed) {
      throw new AuthWrongCredentialException();
    }

    const accessToken = await this.jwtGenerateService.generateAccessToken({ id: target.id, type });
    const refreshToken = await this.jwtGenerateService.generateRefreshToken({ id: target.id, type });

    return { person: filterSensitiveData(target), accessToken, refreshToken };
  }

  async getNewToken() {
    const storage = this.als.getStore();
    const { type, refreshToken, exp } = storage;
    const person = type === UserType.User ? storage.user : storage.driver;
    if (person.refreshToken !== refreshToken) {
      throw new AuthInvalidRefreshTokenException();
    }

    const accessToken = this.jwtGenerateService.generateAccessToken({ id: person.id, type });

    const result = { person: filterSensitiveData(person), accessToken, refreshToken, type };
    // NOTE 리프레시 토큰의 남은 시간이 2시간 이내일경우
    const timeRemaining = compareExp(exp);
    if (timeRemaining < 3600 * 2) {
      // NOTE 새 리프레시 토큰을 발급하고 이를 업데이트
      const refreshToken = await this.jwtGenerateService.generateRefreshToken({ id: person.id, type });
      result.refreshToken = refreshToken;
    }

    return result;
  }

  async googleAuth(redirectResult: GoogleAuthType) {
    const { email, name, photo, provider, id, userType } = redirectResult;

    if (!userType || !Object.values(UserType).includes(userType)) {
      throw new InvalidUserTypeException();
    }

    const repo = userType === UserType.User ? this.userRepository : this.driverRepository;
    const target = await repo.findByEmail(email);

    if (target) {
      if (target.provider !== provider || target.providerId !== id) {
        throw new UnauthorizedException();
      }

      const accessToken = await this.jwtGenerateService.generateAccessToken({ id: target.id, type: userType });
      const refreshToken = await this.jwtGenerateService.generateRefreshToken({ id: target.id, type: userType });

      return { person: filterSensitiveData(target), accessToken, refreshToken, userType };
    }

    const data: GoogleCreateDTO = { email, name, image: photo, provider, providerId: id };
    const person = await repo.createByGoogleCreateDTO(data);

    const accessToken = await this.jwtGenerateService.generateAccessToken({ id: person.id, type: userType });
    const refreshToken = await this.jwtGenerateService.generateRefreshToken({ id: person.id, type: userType });

    return { person: filterSensitiveData(person), accessToken, refreshToken, userType };
  }
}
