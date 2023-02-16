import * as mongoose from 'mongoose';

export interface MerchantsInterface extends mongoose.Document {
  readonly userId: string;
  readonly apiKey: string;
  clientName: string;
  clientSecret: string;
  clientDescription: string;
  websiteUrl: string;
  email: string;
  mobile: string;
  address: string;
  isConfirmed: string;
  status: string;
  other?: string;
}
