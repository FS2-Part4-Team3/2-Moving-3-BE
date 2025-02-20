import googleConfig from '#configs/google.config.js';
import { InvalidUserTypeException } from '#exceptions/common.exception.js';
import { InternalServerErrorException } from '#exceptions/http.exception.js';
import { UserType } from '#types/common.types.js';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

export class GoogleVerifyStrategy extends PassportStrategy(Strategy, 'googleVerify') {
  constructor() {
    const googleClientId = googleConfig.googleClientId;
    const googleClientSecret = googleConfig.googleClientSecret;
    super({
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: '/auth/oauth2/redirect/google/verify',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  authenticate(req: any, options?: any) {
    const userType = req.params.userType ? req.params.userType : req.query.state;

    if (!userType || !Object.values(UserType).includes(userType)) {
      throw new InvalidUserTypeException();
    }

    super.authenticate(req, { ...options, state: userType });
  }

  async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const { state } = req.query;
      if (!state) {
        throw new InternalServerErrorException('state가 없습니다');
      }

      const userType = state;
      const { displayName, emails, photos, provider, id } = profile;
      const user = {
        email: emails[0].value,
        name: displayName,
        photo: photos[0].value,
        provider,
        id,
        userType,
      };
      const result = { ...user, accessToken, refreshToken };
      done(null, result);
    } catch (error) {
      done(error);
    }
  }
}
