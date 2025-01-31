import { AuthInvalidPasswordException } from '#auth/auth.exception.js';
import { passwordRegex } from '#auth/types/auth.types.js';
import { BadRequestException } from '#exceptions/http.exception.js';
import hashingPassword from '#utils/hashingPassword.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class HashPasswordGuard implements CanActivate {
  private hashing(body: any, field: string, saltName: string) {
    const originalPw = body[field];
    if (typeof originalPw !== 'string' || originalPw.trim().length <= 0 || !passwordRegex.test(originalPw)) {
      throw new AuthInvalidPasswordException(field);
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashingPassword(originalPw.trim(), salt);

    body[field] = hash;
    body[saltName] = salt;
  }

  async canActivate(context: ExecutionContext) {
    const body = context.switchToHttp().getRequest().body;

    if (body.password) {
      this.hashing(body, 'password', 'salt');
      return true;
    }
    if (body.newPw) {
      this.hashing(body, 'newPw', 'newSalt');
      return true;
    }

    throw new BadRequestException('비밀번호가 없습니다.');
  }
}
