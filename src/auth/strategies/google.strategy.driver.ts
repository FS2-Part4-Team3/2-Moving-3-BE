import googleConfig from '#configs/google.config.js';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

export class GoogleDriverStrategy extends PassportStrategy(Strategy, 'google/driver') {
  constructor() {
    const googleClientId = googleConfig.googleClientId;
    const googleClientSecret = googleConfig.googleClientSecret;
    super({
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: '/auth/oauth2/redirect/google/driver',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const { displayName, emails, photos, provider, id } = profile;
      console.log('🚀 ~ GoogleStrategy ~ validate ~ profile:', profile);
      const user = {
        email: emails[0].value,
        name: displayName,
        photo: photos[0].value,
        provider,
        id,
      };
      console.log('🚀 ~ GoogleStrategy ~ validate ~ user:', user);
      const result = { ...user, accessToken, refreshToken };
      done(null, result);
    } catch (error) {
      done(error);
    }
  }
}
