import { Injectable } from '@nestjs/common';
// import * as bCrypt from 'bcryptjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHasherService {
  public async hashPassword(password: string): Promise<any> {
    return await bcrypt.hash(password, 10);
  }

  public async comparePasswords(
    plainText: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainText, encryptedPassword);
  }
}
