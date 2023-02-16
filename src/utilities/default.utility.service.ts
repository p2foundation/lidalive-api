import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DefaultUtilityService {
  private logger = new Logger('DefaultUtilityService');

  private possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  private text = '';
  private date = new Date();
  private day = '';

  public generateRandomMerchantKeys(): any {
    // const date1 = new Date();
    this.day = (this.date.getDate() < 10 ? '0' : '') + this.date.getDate();
    const month =
      (this.date.getMonth() + 1 < 10 ? '0' : '') + (this.date.getMonth() + 1);
    const year = this.date.getFullYear().toString().substr(2, 2);
    const customDate = '' + month + this.day + year;
    for (let i = 0; i < 24; i++) {
      this.text += this.possible.charAt(
        Math.floor(Math.random() * this.possible.length),
      );
    }
    const transId = this.text + customDate;
    this.logger.log('generated MerchantKey ++++ ' + transId);
    return transId;
  }

  public generateMerchantSecret(): any {
    const day = (this.date.getDate() < 10 ? '0' : '') + this.date.getDate();
    const month =
      (this.date.getMonth() + 1 < 10 ? '0' : '') + (this.date.getMonth() + 1);
    const year = this.date.getFullYear().toString().substr(2, 2);
    const customDate = '' + month + day + year;
    for (let i = 0; i < 10; i++) {
      this.text += this.possible.charAt(
        Math.floor(Math.random() * this.possible.length),
      );
    }
    const transId = this.text + customDate;
    this.logger.log('generated MerchantSecret --- ' + transId);
    return transId;
  }

  public generateReferenceNumber(): any {
    this.day = (this.date.getDate() < 10 ? '0' : '') + this.date.getDate();
    const month =
      (this.date.getMonth() + 1 < 10 ? '0' : '') + (this.date.getMonth() + 1);
    const year = this.date.getFullYear().toString().substr(2, 2);
    const customDate = '' + month + this.day + year;
    for (let i = 0; i < 18; i++) {
      this.text += this.possible.charAt(
        Math.floor(Math.random() * this.possible.length),
      );
    }
    const transId = this.text + customDate;
    this.logger.log('generated MerchantSecret --- ' + transId);
    return transId;
  }
}
