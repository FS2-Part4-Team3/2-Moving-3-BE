import {
  AuthInvalidRefreshTokenException,
  AuthUserAlreadyExistException,
  AuthWrongCredentialException,
  AuthWrongPasswordException,
} from '#auth/auth.exception.js';
import { AuthRepository } from '#auth/auth.repository.js';
import { IAuthService } from '#auth/interfaces/auth.service.interface.js';
import { JwtGenerateService } from '#auth/jwt-generate.service.js';
import { SocialCreateDTO } from '#auth/types/provider.dto.js';
import { SocialAuthType } from '#auth/types/provider.types.js';
import { SignInDTO, SignUpDTO } from '#auth/types/sign.dto.js';
import { UpdatePasswordDTO } from '#auth/types/update-password.dto.js';
import { DriverRepository } from '#drivers/driver.repository.js';
import { InvalidUserTypeException } from '#exceptions/common.exception.js';
import { ForbiddenException, UnauthorizedException } from '#exceptions/http.exception.js';
import { IStorage, UserType } from '#types/common.types.js';
import { UserRepository } from '#users/user.repository.js';
import compareExp from '#utils/compareExp.js';
import filterSensitiveData from '#utils/filterSensitiveData.js';
import hashingPassword from '#utils/hashingPassword.js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly driverRepository: DriverRepository,
    private readonly jwtGenerateService: JwtGenerateService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getMe() {
    const storage = this.als.getStore();

    const person = storage.type === UserType.User ? storage.user : storage.driver;

    return await filterSensitiveData(person);
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

    await this.authRepository.upsert(person.id, refreshToken);

    return { person: await filterSensitiveData(person), accessToken, refreshToken };
  }

  async updatePassword(body: UpdatePasswordDTO) {
    const { type, user, driver } = this.als.getStore();
    const repo = type === UserType.User ? this.userRepository : this.driverRepository;

    const target = type === UserType.User ? user : driver;
    if (target.password !== hashingPassword(body.oldPw, target.salt)) {
      throw new AuthWrongPasswordException();
    }

    const data = { password: body.newPw, salt: body.newSalt };
    const person = await repo.update(target.id, data);
    const accessToken = await this.jwtGenerateService.generateAccessToken({ id: person.id, type });
    const refreshToken = await this.jwtGenerateService.generateRefreshToken({ id: person.id, type });
    person.type = type;

    await this.authRepository.upsert(person.id, refreshToken);

    return { person: await filterSensitiveData(person), accessToken, refreshToken };
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
    target.type = type;

    await this.authRepository.upsert(target.id, refreshToken);

    return { person: await filterSensitiveData(target), accessToken, refreshToken };
  }

  async getNewToken() {
    const storage = this.als.getStore();
    const { type, refreshToken, exp } = storage;
    const person = type === UserType.User ? storage.user : storage.driver;
    if (person.refreshToken !== refreshToken) {
      throw new AuthInvalidRefreshTokenException();
    }

    const accessToken = this.jwtGenerateService.generateAccessToken({ id: person.id, type });

    const result = { person: await filterSensitiveData(person), accessToken, refreshToken, type };
    // NOTE 리프레시 토큰의 남은 시간이 2시간 이내일경우
    const timeRemaining = compareExp(exp);
    if (timeRemaining < 3600 * 2) {
      // NOTE 새 리프레시 토큰을 발급하고 이를 업데이트
      const refreshToken = await this.jwtGenerateService.generateRefreshToken({ id: person.id, type });
      result.refreshToken = refreshToken;
    }

    return result;
  }

  async signOut() {
    const { userId, driverId, type } = this.als.getStore();
    const id = type === UserType.User ? userId : driverId;

    return await this.authRepository.delete(id);
  }

  async findLoggedInUser(id: string) {
    let isOnline = false;
    const user = await this.authRepository.findByLoginId(id);

    if (user) {
      // NOTE 리프레시 토큰이 만료되었을 경우
      try {
        const jwtSecret = this.configService.get('jwtSecret');
        await this.jwtService.verifyAsync(user.refreshToken, { secret: jwtSecret });
      } catch {
        return { id, isOnline };
      }

      isOnline = true;
    }

    return { id, isOnline };
  }

  async socialAuth(redirectResult: SocialAuthType) {
    const { email, name, photo, provider, id, userType } = redirectResult;

    if (!userType || !Object.values(UserType).includes(userType)) {
      throw new InvalidUserTypeException();
    }

    const repo = userType === UserType.User ? this.userRepository : this.driverRepository;
    const providerId = id.toString();
    const target = await repo.findByEmail(email);

    let person;
    if (target) {
      if (target.provider !== provider || target.providerId !== providerId) {
        throw new UnauthorizedException();
      }

      person = target;
    } else {
      const data: SocialCreateDTO = {
        email,
        name,
        image: photo,
        provider,
        providerId,
      };

      person = await repo.createByProviderCreateDTO(data);
    }

    const accessToken = await this.jwtGenerateService.generateAccessToken({ id: person.id, type: userType });
    const refreshToken = await this.jwtGenerateService.generateRefreshToken({ id: person.id, type: userType });

    person.type = userType;

    await this.authRepository.upsert(person.id, refreshToken);

    return { person: await filterSensitiveData(person), accessToken, refreshToken };
  }

  async socialAuthVerify(redirectResult: SocialAuthType) {
    const { email, provider, id, userType, userId } = redirectResult;

    if (!userType || !Object.values(UserType).includes(userType)) {
      throw new InvalidUserTypeException();
    }

    const repo = userType === UserType.User ? this.userRepository : this.driverRepository;
    const providerId = id.toString();
    const target = await repo.findByEmail(email);

    if (!target || target.id !== userId) {
      throw new ForbiddenException();
    }

    if (target.provider !== provider || target.providerId !== providerId) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.jwtGenerateService.generateAccessToken({ id: target.id, type: userType });
    const refreshToken = await this.jwtGenerateService.generateRefreshToken({ id: target.id, type: userType });

    target.type = userType;

    await this.authRepository.upsert(target.id, refreshToken);

    return { person: await filterSensitiveData(target), accessToken, refreshToken };
  }
}
