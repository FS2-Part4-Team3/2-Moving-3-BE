import naverConfig from '#configs/naver.config.js';
import { InvalidUserTypeException } from '#exceptions/common.exception.js';
import { InternalServerErrorException } from '#exceptions/http.exception.js';
import { UserType } from '#types/common.types.js';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: naverConfig.naverClientId,
      clientSecret: naverConfig.naverClientSecret,
      callbackURL: '/auth/oauth2/redirect/naver',
      passReqToCallback: true,
    });
  }

  authenticate(req: any, options?: any) {
    const userType = req.params.userType ? req.params.userType : req.query.state;

    if (!userType || !Object.values(UserType).includes(userType)) {
      console.error('Invalid userType6:', userType);
      throw new InvalidUserTypeException();
    }

    super.authenticate(req, { ...options, state: userType });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      const { state } = req.query;
      if (!state) {
        throw new InternalServerErrorException('state가 없습니다');
      }

      const userType = state;

      const { _json, provider, id, displayName } = profile;
      const user = {
        email: _json.email,
        name: displayName,
        photo: _json.profile_image,
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
