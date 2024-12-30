import hashingPassword from '#utils/hashingPassword.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class HashPasswordGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.body.password) return true;

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashingPassword(request.body.password, salt);

    request.body.password = hash;
    request.body.salt = salt;

    return true;
  }
}
