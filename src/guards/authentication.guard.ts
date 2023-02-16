import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private logger = new Logger('AuthenticationGuard');

  canActivate(context: ExecutionContext): boolean {
    const host = context.switchToHttp();
    const request = host.getRequest();

    const user = request['user'];

    this.logger.log(`user: ${user}`);

    if (!user) {
      this.logger.error('User not authenticated, denying access...');
      throw new UnauthorizedException();
    }
    this.logger.log(`User authenticated: ${user}, allowing access -> `);

    return true;
  }
}
