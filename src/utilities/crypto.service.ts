import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  private logger = new Logger('CryptoService');

  public async generateSaltPassword(rawText: any): Promise<any> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(rawText, saltOrRounds);
    this.logger.log(`hashed rawText: ${hash}`);
    return hash;
  }

  public async randomStringGenerator(): Promise<any> {
    const rsg = await uuid();
    this.logger.log(`generated uuid: ${rsg}`);
    return JSON.stringify(rsg);
  }
}
