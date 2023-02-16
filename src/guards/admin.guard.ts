import { AuthorizationGuard } from './authorization.guard';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard extends AuthorizationGuard {
  constructor() {
    super(['admin']);
  }
}
