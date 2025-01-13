import googleConfig from '#configs/google.config.js';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const googleClientId = googleConfig.googleClientId;
    const googleClientSecret = googleConfig.googleClientSecret;
    super({
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: '/auth/oauth2/redirect/google',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const { displayName, emails, photos, provider, sub } = profile;
      console.log('🚀 ~ GoogleStrategy ~ validate ~ profile:', profile);
      const user = {
        email: emails[0].value,
        name: displayName,
        photo: photos[0].value,
        provider,
        sub,
      };
      console.log('🚀 ~ GoogleStrategy ~ validate ~ user:', user);
      const result = { ...user, accessToken, refreshToken };
      done(null, result);
    } catch (error) {
      done(error);
    }
  }
}
