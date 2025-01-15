import { BadRequestException } from '#exceptions/http.exception.js';
import hashingPassword from '#utils/hashingPassword.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class HashPasswordGuard implements CanActivate {
  private hashing(body: any, field: string, saltName: string) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashingPassword(body[field].trim(), salt);

    body[field] = hash;
    body[saltName] = salt;
  }

  async canActivate(context: ExecutionContext) {
    const body = context.switchToHttp().getRequest().body;

    if (body.password) {
      if (typeof body.password !== 'string' || body.password.trim().length <= 0) {
        throw new BadRequestException('비밀번호는 1글자 이상의 문자열입니다.');
      }
      this.hashing(body, 'password', 'salt');
      return true;
    }
    if (body.newPw) {
      if (typeof body.newPw !== 'string' || body.newPw.trim().length <= 0) {
        throw new BadRequestException('새 비밀번호는 1글자 이상의 문자열입니다.');
      }
      this.hashing(body, 'newPw', 'newSalt');
      return true;
    }

    throw new BadRequestException('비밀번호는 1글자 이상의 문자열입니다.');

    if (!body.password) return false;

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashingPassword(body.password, salt);

    body.password = hash;
    body.salt = salt;

    return true;
  }
}
