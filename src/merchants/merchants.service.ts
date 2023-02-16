import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { MerchantsInterface } from './interface/merchants.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecurityInterface } from '../security/interface/security.interface';
import { CryptoService } from 'src/utilities/crypto.service';
import { DefaultUtilityService } from 'src/utilities/default.utility.service';

@Injectable()
export class MerchantsService {
  private logger = new Logger('MerchantsService');

  constructor(
    @InjectModel('Merchants')
    private readonly merchantsModel: Model<MerchantsInterface>,
    private cryptoService: CryptoService,
    private defaultUtilityService: DefaultUtilityService,
  ) {}

  public async getRegisteredMerchants(): Promise<any> {
    const grm = await this.merchantsModel.find().exec();
    const totalCount = await this.merchantsModel.countDocuments();
    return { grm, totalCount };
  }

  public async findMerchantById(merchantId: string): Promise<any> {
    return this.merchantsModel.findById({ _id: merchantId });
  }

  public async registerNewMerchant(
    userId: SecurityInterface,
    merchantsData: MerchantsInterface,
  ): Promise<MerchantsInterface> {
    const merchant = await this.merchantsModel.findOne({
      $or: [{ email: merchantsData.email }, { userName: merchantsData.mobile }],
    });
    if (merchant) {
      throw new UnauthorizedException(
        `Merchant already registered with this: ${merchantsData.email}`,
      );
    }

    const {
      clientName,
      clientDescription,
      websiteUrl,
      email,
      mobile,
      address,
    } = merchantsData;

    const secret = this.defaultUtilityService.generateMerchantSecret();
    const key = this.defaultUtilityService.generateRandomMerchantKeys();

    const payload: any = {
      userId: userId,
      clientName: clientName,
      clientSecret: secret,
      apiKey: key,
      clientDescription: clientDescription,
      websiteUrl: websiteUrl,
      email: email,
      mobile: mobile,
      address: address,
    };
    const newMerchants = await new this.merchantsModel(payload);
    try {
      await newMerchants.save();
    } catch (e) {
      this.logger.error(`error save new merchant${e}`);
    }
    return newMerchants;
  }

  public async updateMerchantRecord(
    merchantId: string,
    changes: MerchantsInterface,
  ): Promise<MerchantsInterface> {
    const um = await this.merchantsModel.findOneAndUpdate(
      { _id: merchantId },
      changes,
      { new: true },
    );
    return um;
  }

  public async confirmMerchantAccount(
    merchantId: string,
    change: MerchantsInterface,
  ): Promise<any> {
    return this.merchantsModel.findOneAndUpdate({ _id: merchantId }, change, {
      new: true,
    });
  }

  public async deActivateMerchantAccount(
    merchantId: string,
    change: MerchantsInterface,
  ): Promise<any> {
    return this.merchantsModel.findOneAndUpdate({ _id: merchantId }, change, {
      new: true,
    });
  }

  public async deleteMerchantAccount(merchantId: string): Promise<any> {
    this.logger.log(`merchantId: ${merchantId}`);
    return this.merchantsModel.findByIdAndDelete({ _id: merchantId });
  }
}
