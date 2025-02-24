import naverConfig from '#configs/naver.config.js';
import { InvalidUserTypeException } from '#exceptions/common.exception.js';
import { InternalServerErrorException, UnauthorizedException } from '#exceptions/http.exception.js';
import { UserType } from '#types/common.types.js';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naverVerify') {
  constructor() {
    super({
      clientID: naverConfig.naverClientId,
      clientSecret: naverConfig.naverClientSecret,
      callbackURL: '/auth/oauth2/redirect/naver/verify',
      passReqToCallback: true,
    });
  }

  authenticate(req: any, options?: any) {
    let userType, userId;

    if (req.params.userType && req.params.userId) {
      userType = req.params.userType;
      userId = req.params.userId;
    } else if (req.query.state && typeof req.query.state === 'string') {
      try {
        const stateObj = JSON.parse(req.query.state);
        userType = stateObj.userType;
        userId = stateObj.userId;
      } catch (e) {
        throw new InternalServerErrorException('state가 올바르지 않습니다.');
      }
    } else {
      throw new InternalServerErrorException('state가 없습니다.');
    }

    if (!userType || !Object.values(UserType).includes(userType)) {
      throw new InvalidUserTypeException();
    }

    if (!userId) {
      throw new UnauthorizedException();
    }

    super.authenticate(req, { ...options, state: JSON.stringify({ userType, userId }) });
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

      const { userType, userId } = JSON.parse(state);
      const { _json, provider, id, displayName } = profile;
      const user = {
        email: _json.email,
        name: displayName,
        photo: _json.profile_image,
        provider,
        id,
        userType,
      };

      const result = { ...user, accessToken, refreshToken, userId };
      done(null, result);
    } catch (error) {
      done(error);
    }
  }
}
