import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from 'src/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'your-secret-key',
    });
  }

  async validate(payload: CurrentUser) {
    // The payload contains the JWT claims (user data from when token was created)
    // You can add additional validation here if needed (e.g., check if user still exists)
    return { 
      id: payload.sub, 
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName
    };
  }
}
