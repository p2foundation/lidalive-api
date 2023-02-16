import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { JWT_SECRET } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<any> {
    const isValidated = await this.authService.validateUserById(payload.id);
    if (isValidated) {
      return { userId: payload.id, email: payload.email };
    } else {
      throw new UnauthorizedException('UnAuthorized');
    }
  }
}
