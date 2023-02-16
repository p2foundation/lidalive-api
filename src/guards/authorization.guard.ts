import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private logger = new Logger('AuthorizationGuard');

  constructor(private allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const host = context.switchToHttp(),
      request = host.getRequest();

    const user = request['user'];

    const allowed = this.isAllowed(user.roles);

    console.log('user is allowed: ', allowed);

    if (!allowed) {
      console.log(
        'User is authenticated but not authorized, denying access...',
      );
      throw new ForbiddenException();
    }

    console.log('User is authorized, allowing access');

    return true;
  }

  isAllowed(userRoles: string[]): any {
    console.log('Comparing roles: ', this.allowedRoles, userRoles);

    let allowed = false;

    userRoles.forEach((userRole) => {
      this.logger.log('Checking if role is allowed ', userRole);
      if (!allowed && this.allowedRoles.includes(userRole)) {
        allowed = true;
      }
    });

    return allowed;
  }
}
