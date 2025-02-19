import kakaoConfig from '#configs/kakao.config.js';
import { InvalidUserTypeException } from '#exceptions/common.exception.js';
import { InternalServerErrorException } from '#exceptions/http.exception.js';
import { UserType } from '#types/common.types.js';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptionWithRequest } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: kakaoConfig.kakaoClientId,
      clientSecret: kakaoConfig.kakaoClientSecret,
      callbackURL: '/auth/oauth2/redirect/kakao',
      passReqToCallback: true,
      scope: ['account_email', 'profile_nickname', 'profile_image'],
    } as StrategyOptionWithRequest);
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
      const { _json, provider, id } = profile;
      const user = {
        email: _json.kakao_account.email,
        name: _json.properties.nickname,
        photo: _json.properties.profile_image,
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
